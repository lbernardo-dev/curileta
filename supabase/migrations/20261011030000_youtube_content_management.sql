begin;

create table if not exists public.youtube_content_overrides (
  item_key text primary key check (item_key ~ '^(video|song):[A-Za-z0-9_-]{1,180}$'),
  content_type text not null check (content_type in ('video', 'song')),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  is_deleted boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  check ((content_type = 'video' and item_key like 'video:%') or (content_type = 'song' and item_key like 'song:%'))
);

create index if not exists youtube_content_overrides_type_updated_idx
  on public.youtube_content_overrides (content_type, updated_at desc);

alter table public.youtube_content_overrides enable row level security;
revoke all on public.youtube_content_overrides from public, anon, authenticated;
grant all on public.youtube_content_overrides to service_role;

commit;
