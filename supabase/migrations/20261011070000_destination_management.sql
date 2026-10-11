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

create table if not exists public.managed_destinations (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 96),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  media jsonb not null default '[]'::jsonb check (jsonb_typeof(media) = 'array'),
  segments text[] not null default '{}',
  sort_order integer not null default 0 check (sort_order between 0 and 10000),
  is_published boolean not null default false,
  show_on_home boolean not null default false,
  is_deleted boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists managed_destinations_public_order_idx
  on public.managed_destinations (is_published, is_deleted, sort_order, slug);

create table if not exists public.destination_settings (
  setting_key text primary key check (setting_key = 'homepage'),
  home_selection_enabled boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.destination_settings (setting_key)
values ('homepage')
on conflict (setting_key) do nothing;

alter table public.managed_destinations enable row level security;
alter table public.destination_settings enable row level security;
revoke all on public.managed_destinations, public.destination_settings from public, anon, authenticated;
grant all on public.managed_destinations, public.destination_settings to service_role;

commit;
