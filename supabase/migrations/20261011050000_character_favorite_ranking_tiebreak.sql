begin;

create or replace function public.get_character_favorite_ranking_data()
returns table (
  character_slug text,
  favorite_count bigint,
  score_reached_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    favorites.character_slug,
    count(*)::bigint as favorite_count,
    max(favorites.created_at) as score_reached_at
  from public.character_favorites as favorites
  group by favorites.character_slug;
$$;

revoke all on function public.get_character_favorite_ranking_data() from public, anon, authenticated;
grant execute on function public.get_character_favorite_ranking_data() to service_role;

commit;
