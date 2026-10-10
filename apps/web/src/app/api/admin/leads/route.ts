import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET() {
  await requireAdmin(['owner', 'admin']);

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('id, form_slug, locale, name, email, company, category, message, answers, status, email_status, created_at, resolved_at, lead_stage, lead_notes, lead_last_activity_at, lead_deletion_scheduled_at, lead_retention_notified_at')
      .not('lead_stage', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(500);
    if (error) throw error;
    return NextResponse.json({ success: true, data: data || [] }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudieron cargar los leads.' }, { status: 503 });
  }
}
