begin;

create table if not exists public.character_favorites (
  visitor_hash text not null check (visitor_hash ~ '^[a-f0-9]{64}$'),
  character_slug text not null check (character_slug ~ '^[a-z0-9][a-z0-9-]{0,99}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (visitor_hash, character_slug)
);

create index if not exists character_favorites_slug_idx
  on public.character_favorites (character_slug);

create table if not exists public.character_favorite_daily (
  day date not null,
  character_slug text not null check (character_slug ~ '^[a-z0-9][a-z0-9-]{0,99}$'),
  action text not null check (action in ('added', 'removed')),
  event_count bigint not null default 0 check (event_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (day, character_slug, action)
);

create or replace function public.get_character_favorite_counts()
returns table (character_slug text, favorite_count bigint)
language sql
security definer
set search_path = public
as $$
  select favorites.character_slug, count(*)::bigint
  from public.character_favorites as favorites
  group by favorites.character_slug;
$$;

create or replace function public.set_character_favorite(
  p_character_slug text,
  p_visitor_hash text,
  p_is_favorite boolean
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  changed_count integer := 0;
  action_name text;
begin
  if p_character_slug is null or p_character_slug !~ '^[a-z0-9][a-z0-9-]{0,99}$'
    or p_visitor_hash is null or p_visitor_hash !~ '^[a-f0-9]{64}$'
    or p_is_favorite is null then
    raise exception 'Invalid favorite request';
  end if;

  if p_is_favorite then
    insert into public.character_favorites (visitor_hash, character_slug)
    values (p_visitor_hash, p_character_slug)
    on conflict (visitor_hash, character_slug) do nothing;
    get diagnostics changed_count = row_count;
    action_name := 'added';
  else
    delete from public.character_favorites
    where visitor_hash = p_visitor_hash and character_slug = p_character_slug;
    get diagnostics changed_count = row_count;
    action_name := 'removed';
  end if;

  if changed_count > 0 then
    insert into public.character_favorite_daily (day, character_slug, action, event_count)
    values (current_date, p_character_slug, action_name, 1)
    on conflict (day, character_slug, action)
    do update set event_count = public.character_favorite_daily.event_count + 1,
                  updated_at = now();
  end if;

  return changed_count > 0;
end;
$$;

create table if not exists public.home_character_crew_settings (
  setting_key text primary key check (setting_key = 'story-crew'),
  chapter_slug text not null check (chapter_slug ~ '^[a-z0-9][a-z0-9-]{0,99}$'),
  character_slugs text[] not null check (cardinality(character_slugs) between 1 and 6),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.character_favorites enable row level security;
alter table public.character_favorite_daily enable row level security;
alter table public.home_character_crew_settings enable row level security;

revoke all on public.character_favorites, public.character_favorite_daily, public.home_character_crew_settings from public, anon, authenticated;
grant all on public.character_favorites, public.character_favorite_daily, public.home_character_crew_settings to service_role;
revoke all on function public.get_character_favorite_counts() from public, anon, authenticated;
grant execute on function public.get_character_favorite_counts() to service_role;
revoke all on function public.set_character_favorite(text, text, boolean) from public, anon, authenticated;
grant execute on function public.set_character_favorite(text, text, boolean) to service_role;

commit;
