import { NextRequest, NextResponse } from 'next/server';
import { cmsProvider } from '@/lib/cms';
import { getLatestStorySource } from '@/lib/home-character-crew';
import { getHomeCharacterCrewSelection } from '@/lib/home-character-crew.server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/admin';

export async function GET() {
  await requireAdmin(['owner', 'admin', 'editor']);
  const [characters, videos, books, selection] = await Promise.all([
    cmsProvider.getCharacters('es'),
    cmsProvider.getVideos('es'),
    cmsProvider.getBooks('es'),
    getHomeCharacterCrewSelection(),
  ]);
  const source = getLatestStorySource(videos, books);
  const latestEpisode = source?.kind === 'episode' ? videos.find((video) => video.slug === source.slug) : null;
  const latestBook = source?.kind === 'book' ? books.find((book) => book.slug === source.slug) : null;
  const eligible = source?.kind === 'episode'
    ? (latestEpisode?.tags || []).flatMap((tag) => characters.filter((character) => character.slug === tag || character.id === tag))
    : (latestBook?.characters || []).flatMap((slug) => characters.filter((character) => character.slug === slug || character.id === slug));
  const eligibleSlugs = new Set(eligible.map((character) => character.slug));
  return NextResponse.json({
    characters: eligible.filter((character, index, list) => list.findIndex((item) => item.slug === character.slug) === index)
      .map(({ slug, name, mainImage }) => ({ slug, name, image: mainImage.url })),
    source,
    selection: selection ? { ...selection, character_slugs: selection.character_slugs.filter((slug) => eligibleSlugs.has(slug)) } : null,
    needsRefresh: Boolean(selection && source && selection.chapter_slug !== source.slug),
  }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function PUT(request: NextRequest) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  let body: { characterSlugs?: unknown; chapterSlug?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 4096) return new NextResponse(null, { status: 413 });
    body = JSON.parse(raw) as typeof body;
  } catch {
    return NextResponse.json({ success: false, error: 'El formulario no es válido.' }, { status: 400 });
  }

  const [characters, videos, books] = await Promise.all([
    cmsProvider.getCharacters('es'), cmsProvider.getVideos('es'), cmsProvider.getBooks('es'),
  ]);
  const source = getLatestStorySource(videos, books);
  const selected = Array.isArray(body.characterSlugs) ? body.characterSlugs : [];
  const latestEpisode = source?.kind === 'episode' ? videos.find((video) => video.slug === source.slug) : null;
  const latestBook = source?.kind === 'book' ? books.find((book) => book.slug === source.slug) : null;
  const validSlugs = new Set(source?.kind === 'episode'
    ? (latestEpisode?.tags || []).flatMap((tag) => characters.filter((character) => character.slug === tag || character.id === tag).map((character) => character.slug))
    : (latestBook?.characters || []).flatMap((slug) => characters.filter((character) => character.slug === slug || character.id === slug).map((character) => character.slug)));
  if (!source || body.chapterSlug !== source.slug || selected.length < 1 || selected.length > 6 || selected.some((slug) => typeof slug !== 'string' || !validSlugs.has(slug))) {
    return NextResponse.json({ success: false, error: 'Selecciona entre uno y seis personajes del capítulo más reciente.' }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from('home_character_crew_settings').upsert({
      setting_key: 'story-crew',
      chapter_slug: source.slug,
      character_slugs: [...new Set(selected as string[])],
      updated_by: identity.userId,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'setting_key' });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudo guardar la selección.' }, { status: 503 });
  }
}
