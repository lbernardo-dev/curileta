import { NextResponse } from 'next/server';
import { EVENT_PRINTABLES_BUCKET, getPublishedEventPrintable, isEventPrintableAsset } from '@/lib/event-printables.server';
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
  const printable = await getPublishedEventPrintable(slug);
  if (!printable || !isEventPrintableAsset(printable.fileUrl, printable.filePath)) return new NextResponse(null, { status: 404 });

  const { data, error } = await createSupabaseAdminClient().storage.from(EVENT_PRINTABLES_BUCKET).download(printable.filePath);
  if (error || !data) return NextResponse.json({ error: 'El PDF no está disponible.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });

  const locale = new URL(request.url).searchParams.get('locale') === 'en' ? 'en' : 'es';
  const privacyOptOut = request.headers.get('dnt') === '1' || request.headers.get('sec-gpc') === '1';
  if (!privacyOptOut) {
    try {
      await createSupabaseAdminClient().rpc('record_public_analytics', {
        p_event_name: 'event_printable_download',
        p_path: `/events/${printable.eventSlug}/resources/${printable.slug}`,
        p_locale: locale,
      });
    } catch {
      // A successful file delivery must not depend on analytics availability.
    }
  }

  return new NextResponse(data, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${printable.slug}.pdf"; filename*=UTF-8''${encodeURIComponent(printable.slug)}.pdf`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
