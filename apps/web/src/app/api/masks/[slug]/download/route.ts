import { NextRequest, NextResponse } from 'next/server';
import { getPublishedCharacterMask, isCharacterMaskAsset } from '@/lib/character-masks.server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const RATE_LIMIT_MAX_DOWNLOADS = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;
const ipDownloadTracker = new Map<string, { count: number; resetAt: number }>();

function checkDownloadRateLimit(ip: string): boolean {
  const now = Date.now();
  const tracker = ipDownloadTracker.get(ip);

  if (ipDownloadTracker.size > 2000) {
    for (const [key, val] of ipDownloadTracker.entries()) {
      if (val.resetAt < now) ipDownloadTracker.delete(key);
    }
  }

  if (!tracker || tracker.resetAt < now) {
    ipDownloadTracker.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (tracker.count >= RATE_LIMIT_MAX_DOWNLOADS) {
    return false;
  }

  tracker.count += 1;
  return true;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  if (!checkDownloadRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Demasiadas descargas en poco tiempo. Por favor espera un momento.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

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
