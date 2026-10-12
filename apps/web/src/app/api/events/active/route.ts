import { NextResponse } from 'next/server';
import { cmsProvider } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const localeValue = new URL(request.url).searchParams.get('locale');
  const locale = localeValue === 'en' || localeValue === 'es' ? localeValue : undefined;
  try {
    const event = await cmsProvider.getActiveEvent(locale);
    return NextResponse.json({ success: true, event }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch {
    return NextResponse.json({ success: false, event: null }, { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } });
  }
}
