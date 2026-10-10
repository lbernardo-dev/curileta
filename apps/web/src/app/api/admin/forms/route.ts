import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET() {
  await requireAdmin(['owner', 'admin']);

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('contact_forms')
      .select('id, slug, title, description, enabled, fields, notification_settings, updated_at')
      .order('slug');
    if (error) throw error;
    return NextResponse.json({ success: true, data: data || [] }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudieron cargar los formularios.' }, { status: 503 });
  }
}
