import { NextRequest, NextResponse } from 'next/server';
import { cmsProvider } from '@curileta/cms';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'es';

  try {
    const locations = await cmsProvider.getLocations(locale);
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
