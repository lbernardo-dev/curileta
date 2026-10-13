import { NextResponse } from 'next/server';
import { EVENT_PRINTABLES_BUCKET, getPublishedEventPrintable, isEventPrintableAsset } from '@/lib/event-printables.server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
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
