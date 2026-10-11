import { NextRequest, NextResponse } from 'next/server';
import { cleanupUnreferencedSiteMedia } from '@/lib/site-media.server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });
  }

  try {
    const result = await cleanupUnreferencedSiteMedia();
    return NextResponse.json({ success: true, ...result }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    return NextResponse.json({
      success: false,
      error: 'No se pudo completar la limpieza de imágenes huérfanas.',
    }, { status: 503, headers: { 'Cache-Control': 'private, no-store' } });
  }
}
