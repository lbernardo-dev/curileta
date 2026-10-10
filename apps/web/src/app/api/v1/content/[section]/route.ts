import { NextRequest, NextResponse } from 'next/server';
import { cmsProvider } from '@/lib/cms';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'es';

  try {
    switch (section.toLowerCase()) {
      case 'hero': {
        const settings = await cmsProvider.getSiteSettings(locale);
        return NextResponse.json({ success: true, section: 'hero', data: settings });
      }

      case 'characters': {
        const characters = await cmsProvider.getCharacters(locale);
        return NextResponse.json({ success: true, section: 'characters', total: characters.length, data: characters });
      }

      case 'books': {
        const books = await cmsProvider.getBooks(locale);
        return NextResponse.json({ success: true, section: 'books', total: books.length, data: books });
      }

      case 'letters': {
        const letters = await cmsProvider.getLetters(locale);
        return NextResponse.json({ success: true, section: 'letters', total: letters.length, data: letters });
      }

      case 'globe':
      case 'locations': {
        const locations = await cmsProvider.getLocations(locale);
        const milestones = await cmsProvider.getNarrativeMilestones(locale);
        return NextResponse.json({
          success: true,
          section: 'globe',
          data: { locations, milestones },
        });
      }

      case 'radar': {
        const locations = await cmsProvider.getLocations(locale);
        const milestones = await cmsProvider.getNarrativeMilestones(locale);
        return NextResponse.json({
          success: true,
          section: 'radar',
          data: { locations, milestones },
        });
      }

      case 'trail':
      case 'waypoints': {
        const waypoints = await cmsProvider.getTrailWaypoints(locale);
        return NextResponse.json({ success: true, section: 'trail', total: waypoints.length, data: waypoints });
      }

      case 'videos': {
        const videos = await cmsProvider.getVideos(locale);
        return NextResponse.json({ success: true, section: 'videos', total: videos.length, data: videos });
      }

      case 'wallpapers': {
        const wallpapers = await cmsProvider.getWallpapers(locale);
        return NextResponse.json({ success: true, section: 'wallpapers', total: wallpapers.length, data: wallpapers });
      }

      case 'universe':
      case 'roadmap': {
        const roadmap = await cmsProvider.getUniverseRoadmap(locale);
        return NextResponse.json({ success: true, section: 'universe', total: roadmap.length, data: roadmap });
      }

      case 'collaborations': {
        const collabs = await cmsProvider.getCollaborations(locale);
        return NextResponse.json({ success: true, section: 'collaborations', total: collabs.length, data: collabs });
      }

      case 'seasonal':
      case 'events': {
        const activeEvent = await cmsProvider.getActiveEvent(locale);
        const allEvents = await cmsProvider.getSeasonalEvents(locale);
        return NextResponse.json({
          success: true,
          section: 'seasonal',
          activeEvent,
          allEvents,
        });
      }

      case 'all': {
        const [
          settings,
          characters,
          books,
          letters,
          locations,
          milestones,
          waypoints,
          videos,
          wallpapers,
          universe,
          collaborations,
          activeEvent,
        ] = await Promise.all([
          cmsProvider.getSiteSettings(locale),
          cmsProvider.getCharacters(locale),
          cmsProvider.getBooks(locale),
          cmsProvider.getLetters(locale),
          cmsProvider.getLocations(locale),
          cmsProvider.getNarrativeMilestones(locale),
          cmsProvider.getTrailWaypoints(locale),
          cmsProvider.getVideos(locale),
          cmsProvider.getWallpapers(locale),
          cmsProvider.getUniverseRoadmap(locale),
          cmsProvider.getCollaborations(locale),
          cmsProvider.getActiveEvent(locale),
        ]);

        return NextResponse.json({
          success: true,
          section: 'all',
          data: {
            settings,
            characters,
            books,
            letters,
            locations,
            milestones,
            waypoints,
            videos,
            wallpapers,
            universe,
            collaborations,
            activeEvent,
          },
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown section '${section}'. Valid sections: hero, characters, books, letters, globe, radar, trail, videos, wallpapers, universe, collaborations, seasonal, all`,
          },
          { status: 404 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
