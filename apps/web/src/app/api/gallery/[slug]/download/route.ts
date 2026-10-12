import { NextResponse } from 'next/server';
import { getGalleryItemBySlug } from '@/lib/gallery.server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return new NextResponse(null, { status: 404 });
  const item = await getGalleryItemBySlug(slug);
  if (!item) return new NextResponse(null, { status: 404 });

  try {
    const { data, error } = await createSupabaseAdminClient().storage.from('curileta-site-media').download(item.storage_path);
    if (error || !data) return NextResponse.json({ error: 'La imagen no está disponible para descarga.' }, { status: 503 });
    const bytes = new Uint8Array(await data.arrayBuffer());
    const isJpeg = item.storage_path.toLowerCase().endsWith('.jpg');
    const extension = isJpeg ? 'jpg' : 'webp';
    return new NextResponse(bytes, {
      headers: {
        'Content-Type': isJpeg ? 'image/jpeg' : 'image/webp',
        'Content-Length': String(bytes.byteLength),
        'Content-Disposition': `attachment; filename="curileta-${slug}.${extension}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'La imagen no está disponible para descarga.' }, { status: 503 });
  }
}
