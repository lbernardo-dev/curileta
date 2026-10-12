begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'curileta-site-media',
  'curileta-site-media',
  true,
  104857600,
  array[
    'image/webp',
    'video/mp4', 'video/webm',
    'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/webm'
  ]::text[]
)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.site_events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 80),
  name jsonb not null check (jsonb_typeof(name) = 'object'),
  description jsonb not null default '{"es":"","en":""}'::jsonb check (jsonb_typeof(description) = 'object'),
  theme_key text not null check (theme_key ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(theme_key) <= 48),
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  time_zone text not null default 'Europe/Madrid' check (length(time_zone) between 1 and 80),
  activation_mode text not null default 'scheduled' check (activation_mode in ('scheduled', 'manual')),
  enabled boolean not null default false,
  manual_active boolean not null default false,
  priority integer not null default 0 check (priority between 0 and 100),
  hero_video_url text not null default '',
  hero_video_path text not null default '' check (hero_video_path = '' or hero_video_path ~ '^events/[0-9a-f-]{36}\.(mp4|webm)$'),
  ambient_audio_url text not null default '',
  ambient_audio_path text not null default '' check (ambient_audio_path = '' or ambient_audio_path ~ '^events/[0-9a-f-]{36}\.(mp3|m4a|ogg|webm)$'),
  scare_sound_url text not null default '',
  scare_sound_path text not null default '' check (scare_sound_path = '' or scare_sound_path ~ '^events/[0-9a-f-]{36}\.(mp3|m4a|ogg|webm)$'),
  palette jsonb not null default '{}'::jsonb check (jsonb_typeof(palette) = 'object'),
  effects jsonb not null default '{}'::jsonb check (jsonb_typeof(effects) = 'object'),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_events_schedule_idx
  on public.site_events (enabled, priority desc, starts_at, ends_at);

-- Calendar driven themes cannot overlap. The singleton control row handles explicit admin overrides.
alter table public.site_events
  drop constraint if exists site_events_scheduled_window_excl;
alter table public.site_events
  add constraint site_events_scheduled_window_excl
  exclude using gist (tstzrange(starts_at, ends_at, '[]') with &&)
  where (enabled and activation_mode = 'scheduled');

create table if not exists public.site_theme_settings (
  setting_key text primary key check (setting_key = 'base'),
  name jsonb not null default '{"es":"Curileta","en":"Curileta"}'::jsonb check (jsonb_typeof(name) = 'object'),
  theme_key text not null default 'custom' check (theme_key ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(theme_key) <= 48),
  hero_video_url text not null default '',
  hero_video_path text not null default '' check (hero_video_path = '' or hero_video_path ~ '^events/[0-9a-f-]{36}\.(mp4|webm)$'),
  ambient_audio_url text not null default '',
  ambient_audio_path text not null default '' check (ambient_audio_path = '' or ambient_audio_path ~ '^events/[0-9a-f-]{36}\.(mp3|m4a|ogg|webm)$'),
  palette jsonb not null default '{"accent":"#1b8a44","accentStrong":"#0d5c2c","canvasLight":"#fafdf7","surfaceLight":"#f1f7ee","textLight":"#17231a","canvasDark":"#101812","surfaceDark":"#1f1f1f","textDark":"#f4f8f3"}'::jsonb check (jsonb_typeof(palette) = 'object'),
  effects jsonb not null default '{"decorationsEnabled":false,"motionEnabled":true,"decorations":[],"decorationCount":16,"decorationSpeed":"steady","decorationOpacity":0.46,"soundEnabled":false,"scareEffectsEnabled":false}'::jsonb check (jsonb_typeof(effects) = 'object'),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.site_theme_settings (setting_key)
values ('base')
on conflict (setting_key) do nothing;

create table if not exists public.site_theme_control (
  control_key text primary key check (control_key = 'global'),
  override_mode text not null default 'automatic' check (override_mode in ('automatic', 'base', 'event')),
  event_id uuid references public.site_events(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.site_theme_control (control_key)
values ('global')
on conflict (control_key) do nothing;

create or replace function public.set_site_theme_override(p_mode text, p_event_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if p_mode not in ('automatic', 'base', 'event') then
    raise exception 'Invalid theme override mode' using errcode = '22023';
  end if;
  if p_mode = 'event' then
    if p_event_id is null or not exists (select 1 from public.site_events where id = p_event_id) then
      raise exception 'The selected event is unavailable' using errcode = '22023';
    end if;
    update public.site_events
    set enabled = true, activation_mode = 'manual', manual_active = true,
        updated_at = now(), updated_by = p_user_id
    where id = p_event_id;
  elsif p_mode = 'automatic' and p_event_id is not null then
    update public.site_events
    set enabled = false, manual_active = false, updated_at = now(), updated_by = p_user_id
    where id = p_event_id;
    p_event_id := null;
  else
    p_event_id := null;
  end if;

  update public.site_events
  set manual_active = (id = p_event_id), updated_at = now(), updated_by = p_user_id
  where manual_active is distinct from (id = p_event_id);

  insert into public.site_theme_control (control_key, override_mode, event_id, updated_by, updated_at)
  values ('global', p_mode, p_event_id, p_user_id, now())
  on conflict (control_key) do update
  set override_mode = excluded.override_mode,
      event_id = excluded.event_id,
      updated_by = excluded.updated_by,
      updated_at = excluded.updated_at;
end;
$$;

revoke all on function public.set_site_theme_override(text, uuid, uuid) from public, anon, authenticated;
grant execute on function public.set_site_theme_override(text, uuid, uuid) to service_role;

alter table public.site_events enable row level security;
alter table public.site_theme_settings enable row level security;
alter table public.site_theme_control enable row level security;
revoke all on public.site_events from public, anon, authenticated;
revoke all on public.site_theme_settings from public, anon, authenticated;
revoke all on public.site_theme_control from public, anon, authenticated;
grant all on public.site_events to service_role;
grant all on public.site_theme_settings to service_role;
grant all on public.site_theme_control to service_role;

commit;
