begin;

create table if not exists public.home_upcoming_episode_characters (
  setting_key text primary key check (setting_key = 'next-episode'),
  character_slugs text[] not null default '{}'::text[],
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  check (cardinality(character_slugs) <= 100)
);

alter table public.home_upcoming_episode_characters enable row level security;
revoke all on public.home_upcoming_episode_characters from public, anon, authenticated;
grant all on public.home_upcoming_episode_characters to service_role;

commit;
