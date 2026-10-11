import { NextRequest, NextResponse } from 'next/server';
import { cmsProvider } from '@/lib/cms';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/admin';

const ALLOWED_ROLES = ['owner', 'admin', 'editor'] as const;

export async function GET() {
  await requireAdmin([...ALLOWED_ROLES]);

  try {
    const [characters, supabase] = await Promise.all([
      cmsProvider.getCharacters('es'),
      Promise.resolve(createSupabaseAdminClient()),
    ]);
    const { data, error } = await supabase
      .from('home_upcoming_episode_characters')
      .select('character_slugs, updated_at')
      .eq('setting_key', 'next-episode')
      .maybeSingle();

    if (error) throw error;
    const selected = new Set(
      Array.isArray(data?.character_slugs)
        ? data.character_slugs.filter((slug): slug is string => typeof slug === 'string')
        : [],
    );
    const availableSlugs = new Set(characters.map((character) => character.slug));

    return NextResponse.json({
      characters: characters.map(({ slug, name, mainImage }) => ({ slug, name, image: mainImage.url })),
      selectedSlugs: [...selected].filter((slug) => availableSlugs.has(slug)),
      updatedAt: data?.updated_at || null,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'No se pudo cargar la selección del próximo episodio.' }, { status: 503 });
  }
}

export async function PUT(request: NextRequest) {
  const identity = await requireAdmin([...ALLOWED_ROLES]);
  let body: { characterSlugs?: unknown };

  try {
    const raw = await request.text();
    if (raw.length > 8192) return new NextResponse(null, { status: 413 });
    body = JSON.parse(raw) as typeof body;
  } catch {
    return NextResponse.json({ success: false, error: 'El formulario no es válido.' }, { status: 400 });
  }

  const submitted = body.characterSlugs;
  if (!Array.isArray(submitted) || submitted.length > 100 || submitted.some((slug) => typeof slug !== 'string')) {
    return NextResponse.json({ success: false, error: 'La lista de personajes no es válida.' }, { status: 400 });
  }

  try {
    const characters = await cmsProvider.getCharacters('es');
    const availableSlugs = new Set(characters.map((character) => character.slug));
    const uniqueSlugs = [...new Set(submitted as string[])];
    if (uniqueSlugs.some((slug) => !availableSlugs.has(slug))) {
      return NextResponse.json({ success: false, error: 'La lista incluye personajes que ya no están disponibles.' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const updatedAt = new Date().toISOString();
    const { error } = await supabase.from('home_upcoming_episode_characters').upsert({
      setting_key: 'next-episode',
      character_slugs: uniqueSlugs,
      updated_by: identity.userId,
      updated_at: updatedAt,
    }, { onConflict: 'setting_key' });
    if (error) throw error;

    return NextResponse.json({ success: true, selectedSlugs: uniqueSlugs, updatedAt });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudo guardar la selección del próximo episodio.' }, { status: 503 });
  }
}
