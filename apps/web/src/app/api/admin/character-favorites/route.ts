import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { getCharacterFavoriteRankings } from '@/lib/character-favorites.server';

export async function GET(request: NextRequest) {
  await requireAdmin(['owner', 'admin', 'analyst']);
  const requested = request.nextUrl.searchParams.get('days') || '30';
  const days = requested === 'all' ? 'all' : (() => {
    const parsed = Number(requested);
    return Number.isFinite(parsed) ? Math.min(1825, Math.max(7, Math.floor(parsed))) : 30;
  })();
  const since = days === 'all' ? null : new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  try {
    const supabase = createSupabaseAdminClient();
    let eventsQuery = supabase.from('character_favorite_daily').select('day, character_slug, action, event_count');
    if (since) eventsQuery = eventsQuery.gte('day', since);
    const [rankings, { data, error }] = await Promise.all([
      getCharacterFavoriteRankings('es'),
      eventsQuery.order('day', { ascending: true }),
    ]);
    if (error) throw error;
    return NextResponse.json({ success: true, days, rankings, data: data || [] }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudieron cargar los votos de personajes.' }, { status: 503 });
  }
}
