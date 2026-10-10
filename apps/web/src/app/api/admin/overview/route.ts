import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const identity = await requireAdmin();
  const canReadInbox = identity.role === 'owner' || identity.role === 'admin';

  try {
    const supabase = createSupabaseAdminClient();
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [submissions, unread, forms, analytics] = await Promise.all([
      supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).gte('created_at', since),
      supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('contact_forms').select('id', { count: 'exact', head: true }).eq('enabled', true),
      supabase.from('analytics_daily').select('event_name, event_count').gte('day', today.toISOString().slice(0, 10)).eq('event_name', 'page_view'),
    ]);

    const latest = canReadInbox
      ? await supabase.from('contact_submissions').select('id, name, email, category, status, created_at, form_slug').order('created_at', { ascending: false }).limit(5)
      : { data: [], error: null };
    const error = submissions.error || unread.error || forms.error || analytics.error || latest.error;
    if (error) throw error;
    const pageViewsToday = (analytics.data || []).reduce((total, row) => total + Number(row.event_count || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        submissionsLastSevenDays: submissions.count || 0,
        unreadSubmissions: unread.count || 0,
        activeForms: forms.count || 0,
        pageViewsToday,
        latestSubmissions: latest.data || [],
      },
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudieron cargar las estadísticas.' }, { status: 503 });
  }
}
