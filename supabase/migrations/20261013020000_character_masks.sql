begin;

create table if not exists public.character_masks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  character_slug text not null check (character_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title jsonb not null check (
    jsonb_typeof(title) = 'object'
    and jsonb_typeof(title->'es') = 'string'
    and jsonb_typeof(title->'en') = 'string'
  ),
  description jsonb not null default '{"es":"","en":""}'::jsonb check (
    jsonb_typeof(description) = 'object'
    and jsonb_typeof(description->'es') = 'string'
    and jsonb_typeof(description->'en') = 'string'
  ),
  preview_image_url text not null default '',
  preview_image_path text not null default '' check (
    preview_image_path = ''
    or preview_image_path ~ '^static:character-mask:[a-z0-9-]+$'
    or preview_image_path ~ '^masks/previews/[0-9a-f-]{36}\.(webp|jpg)$'
  ),
  printable_pdf_url text not null default '',
  printable_pdf_path text not null default '' check (
    printable_pdf_path = ''
    or printable_pdf_path ~ '^static:character-mask:[a-z0-9-]+$'
    or printable_pdf_path ~ '^masks/printables/[0-9a-f-]{36}\.pdf$'
  ),
  sort_order integer not null default 0 check (sort_order between 0 and 10000),
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (length(trim(title->>'es')) between 1 and 120),
  check (length(trim(title->>'en')) between 1 and 120),
  check (length(description->>'es') <= 500 and length(description->>'en') <= 500)
);

create index if not exists character_masks_public_order_idx
  on public.character_masks (is_published, sort_order, character_slug);
create unique index if not exists character_masks_character_slug_unique_idx
  on public.character_masks (character_slug);

update public.site_events as event
set campaign_content = jsonb_set(
  event.campaign_content,
  '{activities}',
  coalesce((
    select jsonb_agg(
      case when activity.value->>'id' = 'mascaras-y-coloreo'
        then activity.value || jsonb_build_object('kind', 'maskLibrary', 'resourceUrl', '', 'resourcePath', '')
        else activity.value
      end
      order by activity.ordinality
    )
    from jsonb_array_elements(coalesce(event.campaign_content->'activities', '[]'::jsonb)) with ordinality as activity(value, ordinality)
  ), '[]'::jsonb),
  true
),
    updated_at = now()
where event.slug = 'halloween'
  and exists (
    select 1 from jsonb_array_elements(coalesce(event.campaign_content->'activities', '[]'::jsonb)) as activity(value)
    where activity.value->>'id' = 'mascaras-y-coloreo'
  );

alter table public.character_masks enable row level security;
revoke all on public.character_masks from public, anon, authenticated;
grant all on public.character_masks to service_role;

insert into public.character_masks (
  slug, character_slug, title, description,
  preview_image_url, preview_image_path, printable_pdf_url, printable_pdf_path,
  sort_order, is_published
) values
  (
    'curileta', 'curileta',
    '{"es":"Máscara de Curileta","en":"Curileta mask"}'::jsonb,
    '{"es":"Recorta la silueta y los ojos para acompañar a Curileta en una nueva aventura.","en":"Cut out the shape and eye openings to join Curileta on a new adventure."}'::jsonb,
    '/images/events/masks/curileta-mask-v1.png', 'static:character-mask:curileta-preview-v1',
    '/files/events/masks/curileta-mask-v1.pdf', 'static:character-mask:curileta-printable-v1',
    0, true
  ),
  (
    'pompon', 'pompon',
    '{"es":"Máscara de Pompón","en":"Pompon mask"}'::jsonb,
    '{"es":"Prepara las orejas, las mejillas y los ojos de Pompón para jugar e imaginar.","en":"Get Pompon’s ears, cheeks and eyes ready for play and make-believe."}'::jsonb,
    '/images/events/masks/pompon-mask-v1.png', 'static:character-mask:pompon-preview-v1',
    '/files/events/masks/pompon-mask-v1.pdf', 'static:character-mask:pompon-printable-v1',
    1, true
  )
on conflict (slug) do nothing;

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
    'wallpaper_download', 'gallery_download', 'mask_download', 'video_vote',
    'content_share_native', 'content_share_copy', 'content_share_whatsapp',
    'content_share_telegram', 'content_share_email', 'content_share_sms',
    'content_share_facebook', 'content_share_linkedin', 'content_share_x'
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
