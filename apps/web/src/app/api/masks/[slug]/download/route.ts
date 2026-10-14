import { NextRequest, NextResponse } from 'next/server';
import { getPublishedCharacterMask, isCharacterMaskAsset } from '@/lib/character-masks.server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = request.nextUrl.searchParams.get('locale');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || (locale !== 'es' && locale !== 'en')) {
    return NextResponse.json({ error: 'No se encontró la máscara.' }, { status: 404 });
  }

  const mask = await getPublishedCharacterMask(slug);
  if (!mask || !isCharacterMaskAsset(mask.printablePdfUrl, mask.printablePdfPath, 'pdf')) {
    return NextResponse.json({ error: 'La máscara no está disponible para descargar.' }, { status: 404 });
  }

  try {
    const pdfUrl = mask.printablePdfUrl.startsWith('/')
      ? new URL(mask.printablePdfUrl, request.nextUrl.origin)
      : mask.printablePdfUrl;
    const file = await fetch(pdfUrl, { cache: 'no-store', signal: AbortSignal.timeout(12_000) });
    if (!file.ok || !file.body) return NextResponse.json({ error: 'No se pudo preparar el PDF. Inténtalo de nuevo.' }, { status: 503 });

    if (request.headers.get('dnt') !== '1' && request.headers.get('sec-gpc') !== '1') {
      try {
        await createSupabaseAdminClient().rpc('record_public_analytics', {
          p_event_name: 'mask_download',
          p_path: `/${locale}/mascaras/${mask.characterSlug}`,
          p_locale: locale,
        });
      } catch {
        // The requested printable remains available if aggregate analytics is temporarily unavailable.
      }
    }

    const filename = `mascara-${slug}.pdf`;
    return new Response(file.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'No se pudo preparar el PDF. Inténtalo de nuevo.' }, { status: 503 });
  }
}
