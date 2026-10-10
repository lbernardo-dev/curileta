-- Add privacy safe, daily aggregate counts for outbound content sharing.
-- The public endpoint validates each content slug against the published CMS
-- catalogue before it calls this function; no visitor identifier is stored.
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
    'wallpaper_download', 'video_vote', 'content_share_native', 'content_share_copy',
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
