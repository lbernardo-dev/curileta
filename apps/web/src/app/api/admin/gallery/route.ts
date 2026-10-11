import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET() {
  await requireAdmin(['owner', 'admin', 'editor']);
  try {
    const supabase = createSupabaseAdminClient();
    const [{ data: categories, error: categoryError }, { data: items, error: itemError }] = await Promise.all([
      supabase.from('gallery_categories').select('slug, name, sort_order').order('sort_order').order('slug'),
      supabase.from('gallery_items').select('id, slug, category_slug, title, description, alt, image_url, storage_path, sort_order, is_published').order('sort_order').order('updated_at', { ascending: false }),
    ]);
    if (categoryError || itemError) throw categoryError || itemError;
    return NextResponse.json({ categories: categories || [], items: items || [], storageAvailable: true }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ categories: [], items: [], storageAvailable: false }, { headers: { 'Cache-Control': 'private, no-store' } });
  }
}
