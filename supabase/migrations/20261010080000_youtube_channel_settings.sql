begin;

create table if not exists public.youtube_channel_settings (
  setting_key text primary key check (setting_key = 'primary'),
  config jsonb not null check (jsonb_typeof(config) = 'object'),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.youtube_channel_settings enable row level security;
revoke all on public.youtube_channel_settings from public, anon, authenticated;
grant all on public.youtube_channel_settings to service_role;

commit;
