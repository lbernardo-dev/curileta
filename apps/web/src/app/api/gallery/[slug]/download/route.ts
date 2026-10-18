import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { getGalleryItemBySlug } from '@/lib/gallery.server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

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

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
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
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return new NextResponse(null, { status: 404 });
  const item = await getGalleryItemBySlug(slug);
  if (!item) return new NextResponse(null, { status: 404 });

  if (!item.storage_path) {
    const asset = getApprovedStaticAsset(item.image_url);
    if (!asset) return new NextResponse(null, { status: 404 });
    try {
      const bytes = await readFile(path.join(process.cwd(), 'public', asset.relativePath));
      return downloadResponse(bytes, slug, asset.contentType, asset.extension);
    } catch {
      return NextResponse.json({ error: 'La imagen no está disponible para descarga.' }, { status: 503 });
    }
  }

  try {
    const { data, error } = await createSupabaseAdminClient().storage.from('curileta-site-media').download(item.storage_path);
    if (error || !data) return NextResponse.json({ error: 'La imagen no está disponible para descarga.' }, { status: 503 });
    const bytes = new Uint8Array(await data.arrayBuffer());
    const isJpeg = item.storage_path.toLowerCase().endsWith('.jpg');
    const extension = isJpeg ? 'jpg' : 'webp';
    return downloadResponse(bytes, slug, isJpeg ? 'image/jpeg' : 'image/webp', extension);
  } catch {
    return NextResponse.json({ error: 'La imagen no está disponible para descarga.' }, { status: 503 });
  }
}

function getApprovedStaticAsset(url: string): { relativePath: string; contentType: string; extension: string } | null {
  const wallpaper = /^\/images\/wallpapers\/(?:desktop|mobile)\/[a-z0-9-]+\.jpg$/i.exec(url);
  if (wallpaper) return { relativePath: url.slice(1), contentType: 'image/jpeg', extension: 'jpg' };
  if (url === '/images/events/halloween-curileta-pompon-wide.webp') {
    return { relativePath: url.slice(1), contentType: 'image/webp', extension: 'webp' };
  }
  return null;
}

function downloadResponse(bytes: Uint8Array, slug: string, contentType: string, extension: string) {
  const body = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(body).set(bytes);

  return new NextResponse(body, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(bytes.byteLength),
      'Content-Disposition': `attachment; filename="curileta-${slug}.${extension}"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
