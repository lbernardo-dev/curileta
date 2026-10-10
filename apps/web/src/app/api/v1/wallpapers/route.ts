import { NextRequest, NextResponse } from 'next/server';
import { cmsProvider } from '@/lib/cms';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'es';
  const category = searchParams.get('category');
  const device = searchParams.get('device');

  try {
    let wallpapers = await cmsProvider.getWallpapers(locale);
    if (category) {
      wallpapers = wallpapers.filter((w) => w.category === category);
    }
    if (device) {
      wallpapers = wallpapers.filter((w) => w.deviceType === device);
    }

    return NextResponse.json({
      success: true,
      total: wallpapers.length,
      data: wallpapers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
