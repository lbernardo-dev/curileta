import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error: retentionError } = await supabase.rpc('purge_expired_contact_submissions');
    if (retentionError) throw retentionError;

    const { data: pending, error: pendingError } = await supabase
      .from('contact_submissions')
      .select('id')
      .not('lead_stage', 'is', null)
      .not('lead_retention_notice_due_at', 'is', null)
      .is('lead_retention_notified_at', null)
      .limit(1000);
    if (pendingError) throw pendingError;

    const ids = (pending || []).map((row) => row.id as string);
    if (!ids.length) return NextResponse.json({ success: true, notified: 0 });

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;
    const to = process.env.CONTACT_TO_EMAIL;
    if (!apiKey || !from || !to) {
      return NextResponse.json({ success: true, notified: 0, notificationPending: ids.length }, { status: 202 });
    }

    const adminUrl = new URL('/admin/leads', request.nextUrl.origin).toString();
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'Curileta: oportunidades pendientes de revisión',
        text: `Hay ${ids.length} oportunidades que llevan 12 meses sin actividad. El plazo de eliminación de 30 días empieza cuando se envía este aviso. Revisa el panel y reanuda o confirma el seguimiento si deben conservarse: ${adminUrl}. Este aviso no incluye datos personales.`,
        html: `<p>Hay ${ids.length} oportunidades que llevan 12 meses sin actividad.</p><p>El plazo de eliminación de 30 días empieza cuando se envía este aviso. Revisa el panel y reanuda o confirma el seguimiento si deben conservarse.</p><p><a href="${adminUrl}">Abrir oportunidades</a></p><p>Este aviso no incluye datos personales.</p>`,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: 'No se pudo enviar el aviso de conservación.' }, { status: 502 });
    }

    const notifiedAt = new Date().toISOString();
    const deleteAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const { error: markError } = await supabase
      .from('contact_submissions')
      .update({ lead_retention_notified_at: notifiedAt, lead_deletion_scheduled_at: deleteAt })
      .in('id', ids)
      .is('lead_retention_notified_at', null);
    if (markError) throw markError;

    return NextResponse.json({ success: true, notified: ids.length });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudo procesar la revisión de conservación.' }, { status: 503 });
  }
}
