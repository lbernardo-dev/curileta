create table if not exists public.book_catalog_settings (
  setting_key text primary key check (setting_key = 'homepage'),
  featured_book_slugs text[] not null default '{}',
  upcoming_books jsonb not null default '[]'::jsonb check (jsonb_typeof(upcoming_books) = 'array'),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.book_catalog_settings enable row level security;
revoke all on public.book_catalog_settings from anon, authenticated;
grant all on public.book_catalog_settings to service_role;
