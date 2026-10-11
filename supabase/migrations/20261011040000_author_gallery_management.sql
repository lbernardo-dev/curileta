begin;

create table if not exists public.author_pages (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  author_name text not null check (length(trim(author_name)) between 1 and 120),
  name jsonb not null check (jsonb_typeof(name) = 'object'),
  biography jsonb not null default '{"es":"","en":""}'::jsonb check (jsonb_typeof(biography) = 'object'),
  quote jsonb not null default '{"es":"","en":""}'::jsonb check (jsonb_typeof(quote) = 'object'),
  portrait_url text not null default '',
  portrait_path text not null default '' check (portrait_path = '' or portrait_path ~ '^authors/portraits/[a-z0-9-]+\.webp$'),
  website_url text not null default '',
  instagram_url text not null default '',
  youtube_url text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create unique index if not exists author_pages_author_name_lower_idx
  on public.author_pages (lower(trim(author_name)));

create table if not exists public.gallery_categories (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name jsonb not null check (jsonb_typeof(name) = 'object'),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category_slug text not null references public.gallery_categories(slug) on update cascade on delete restrict,
  title jsonb not null check (jsonb_typeof(title) = 'object'),
  description jsonb not null default '{"es":"","en":""}'::jsonb check (jsonb_typeof(description) = 'object'),
  alt jsonb not null check (jsonb_typeof(alt) = 'object'),
  image_url text not null,
  storage_path text not null check (storage_path ~ '^gallery/[a-z0-9-]+\.webp$'),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists gallery_items_public_order_idx
  on public.gallery_items (is_published, category_slug, sort_order, updated_at desc);

alter table public.author_pages enable row level security;
alter table public.gallery_categories enable row level security;
alter table public.gallery_items enable row level security;

revoke all on public.author_pages, public.gallery_categories, public.gallery_items from public, anon, authenticated;
grant all on public.author_pages, public.gallery_categories, public.gallery_items to service_role;

create or replace function public.record_public_analytics(
  p_event_name text,
  p_path text,
  p_locale text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_event_name not in (
    'page_view', 'contact_submit', 'book_view', 'book_purchase_click',
    'video_play', 'character_view', 'map_destination_open', 'song_play',
    'wallpaper_download', 'gallery_download', 'video_vote', 'content_share_native', 'content_share_copy',
    'content_share_whatsapp', 'content_share_telegram', 'content_share_email',
    'content_share_sms', 'content_share_facebook', 'content_share_linkedin', 'content_share_x'
  ) then
    raise exception 'Unsupported analytics event';
  end if;

  if p_path is null or length(p_path) > 240 or p_path !~ '^/[a-zA-Z0-9/_-]*$' then
    raise exception 'Invalid analytics path';
  end if;

  if p_locale not in ('es', 'en') then
    raise exception 'Invalid analytics locale';
  end if;

  insert into public.analytics_daily (day, event_name, path, locale, event_count)
  values (current_date, p_event_name, p_path, p_locale, 1)
  on conflict (day, event_name, path, locale)
  do update set event_count = public.analytics_daily.event_count + 1,
                updated_at = now();
end;
$$;

revoke all on function public.record_public_analytics(text, text, text) from public, anon, authenticated;
grant execute on function public.record_public_analytics(text, text, text) to service_role;

commit;
