import { NextRequest, NextResponse } from 'next/server';
import { cmsProvider } from '@/lib/cms';
import { getCharacterFavoriteRankings, hashFavoriteVisitorToken, isValidFavoriteVisitorToken } from '@/lib/character-favorites.server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const noStore = { 'Cache-Control': 'private, no-store' };

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') === 'en' ? 'en' : 'es';
  const visitorToken = request.headers.get('x-favorite-visitor');

  try {
    const rankings = await getCharacterFavoriteRankings(locale);
    if (!rankings.length) throw new Error('Favorite rankings are unavailable');

    let likedSlugs: string[] = [];
    if (visitorToken && isValidFavoriteVisitorToken(visitorToken)) {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from('character_favorites')
        .select('character_slug')
        .eq('visitor_hash', hashFavoriteVisitorToken(visitorToken));
      if (error) throw error;
      likedSlugs = (data || []).map((row) => row.character_slug as string);
    }

    return NextResponse.json({ rankings, likedSlugs }, { headers: noStore });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudieron cargar los favoritos.' }, { status: 503, headers: noStore });
  }
}

export async function POST(request: NextRequest) {
  let body: { locale?: unknown; slug?: unknown; visitorToken?: unknown; favorite?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 2048) return new NextResponse(null, { status: 413, headers: noStore });
    body = JSON.parse(raw) as typeof body;
  } catch {
    return NextResponse.json({ success: false }, { status: 400, headers: noStore });
  }

  const locale = body.locale === 'en' ? 'en' : body.locale === 'es' ? 'es' : '';
  const slug = typeof body.slug === 'string' ? body.slug : '';
  if (!locale || !/^[a-z0-9][a-z0-9-]{0,99}$/.test(slug) || !isValidFavoriteVisitorToken(body.visitorToken) || typeof body.favorite !== 'boolean') {
    return NextResponse.json({ success: false }, { status: 400, headers: noStore });
  }

  const characters = await cmsProvider.getCharacters(locale);
  if (!characters.some((character) => character.slug === slug)) {
    return NextResponse.json({ success: false }, { status: 404, headers: noStore });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.rpc('set_character_favorite', {
      p_character_slug: slug,
      p_visitor_hash: hashFavoriteVisitorToken(body.visitorToken),
      p_is_favorite: body.favorite,
    });
    if (error) throw error;

    const rankings = await getCharacterFavoriteRankings(locale);
    if (!rankings.length) throw new Error('Favorite rankings are unavailable');
    const { data, error: likedError } = await supabase
      .from('character_favorites')
      .select('character_slug')
      .eq('visitor_hash', hashFavoriteVisitorToken(body.visitorToken));
    if (likedError) throw likedError;

    return NextResponse.json({ rankings, likedSlugs: (data || []).map((row) => row.character_slug as string) }, { headers: noStore });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudo guardar el voto. Inténtalo de nuevo.' }, { status: 503, headers: noStore });
  }
}
