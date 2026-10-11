begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'curileta-site-media',
  'curileta-site-media',
  true,
  8388608,
  array['image/webp']::text[]
)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

commit;
