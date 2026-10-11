import { NextRequest, NextResponse } from 'next/server';
import { cmsProvider } from '@/lib/cms';
import { getPublicDestinations } from '@/lib/destinations.server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'es';

  try {
    const locations = await getPublicDestinations(locale === 'en' ? 'en' : 'es');
    const milestones = await cmsProvider.getNarrativeMilestones(locale);
    const waypoints = await cmsProvider.getTrailWaypoints(locale);
    return NextResponse.json({
      success: true,
      totalLocations: locations.length,
      totalMilestones: milestones.length,
      data: {
        locations,
        milestones,
        waypoints,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}
