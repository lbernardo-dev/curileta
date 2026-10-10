begin;

create table if not exists public.image_frame_settings (
  target_key text primary key check (target_key ~ '^[a-z0-9][a-z0-9-]{0,63}$'),
  position_x integer not null default 50 check (position_x between 0 and 100),
  position_y integer not null default 50 check (position_y between 0 and 100),
  zoom numeric(3, 2) not null default 1 check (zoom between 1 and 2),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

comment on table public.image_frame_settings is
  'Encuadres administrables para imágenes dentro de marcos conocidos de la web pública.';

alter table public.image_frame_settings enable row level security;
revoke all on table public.image_frame_settings from public, anon, authenticated;
grant all on table public.image_frame_settings to service_role;

commit;
