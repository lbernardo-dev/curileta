begin;

-- Preserve an unrestricted bucket when allowed_mime_types is NULL. Otherwise,
-- add JPEG without removing the formats already used by the site.
update storage.buckets
set allowed_mime_types = array_append(allowed_mime_types, 'image/jpeg')
where id = 'curileta-site-media'
  and allowed_mime_types is not null
  and not ('image/jpeg' = any(allowed_mime_types));

alter table public.author_pages
  drop constraint if exists author_pages_portrait_path_check;
alter table public.author_pages
  add constraint author_pages_portrait_path_check
  check (portrait_path = '' or portrait_path ~ '^authors/portraits/[a-z0-9-]+\.(webp|jpg)$');

alter table public.gallery_items
  drop constraint if exists gallery_items_storage_path_check;
alter table public.gallery_items
  add constraint gallery_items_storage_path_check
  check (storage_path ~ '^gallery/[a-z0-9-]+\.(webp|jpg)$');

commit;
