begin;

create table if not exists public.event_printables (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.site_events(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  resource_type text not null check (resource_type in ('coloring', 'printable')),
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
  file_url text not null,
  file_path text not null check (file_path ~ '^events/printables/[0-9a-f-]{36}\.pdf$'),
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

create index if not exists event_printables_public_order_idx
  on public.event_printables (event_id, is_published, resource_type, sort_order);

alter table public.event_printables enable row level security;
revoke all on public.event_printables from public, anon, authenticated;
grant all on public.event_printables to service_role;

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
    'wallpaper_download', 'gallery_download', 'mask_download', 'event_printable_download', 'video_vote',
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

update public.site_events as event
set campaign_content = jsonb_set(
  jsonb_set(
    event.campaign_content,
    '{intro}',
    '{"es":"Curileta y Pompón descubren un bosque vestido de naranja. Hay luces entre los árboles, una adivinanza bajo la luna y máscaras listas para imprimir. Las láminas para colorear llegarán próximamente.","en":"Curileta and Pompon discover a forest dressed in orange. Lights glow between the trees, a riddle waits under the moon, and masks are ready to print. Coloring pages are coming soon."}'::jsonb,
    true
  ),
  '{activities}',
  coalesce((
    select jsonb_agg(
      case when activity.value->>'id' = 'mascaras-y-coloreo'
        then activity.value || jsonb_build_object(
          'title', '{"es":"Máscaras y láminas para colorear","en":"Masks and coloring pages"}'::jsonb,
          'description', '{"es":"Imprime las máscaras de Curileta y Pompón. Las láminas del bosque para colorear estarán disponibles próximamente.","en":"Print Curileta and Pompon masks. Forest coloring pages will be available soon."}'::jsonb
        )
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

commit;
