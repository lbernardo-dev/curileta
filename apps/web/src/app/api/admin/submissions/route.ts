import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  await requireAdmin(['owner', 'admin']);
  const status = request.nextUrl.searchParams.get('status');
  const allowedStatuses = ['new', 'in_progress', 'resolved', 'archived'];

  try {
    const supabase = createSupabaseAdminClient();
    let query = supabase
      .from('contact_submissions')
      .select('id, form_slug, locale, name, email, company, category, message, answers, status, email_status, created_at, lead_stage')
      .order('created_at', { ascending: false })
      .limit(100);
    if (status && allowedStatuses.includes(status)) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, data: data || [] }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudieron cargar las consultas.' }, { status: 503 });
  }
}
