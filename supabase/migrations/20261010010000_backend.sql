create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  role text not null check (role in ('owner', 'admin', 'editor', 'analyst')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_forms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  fields jsonb not null default '[]'::jsonb check (jsonb_typeof(fields) = 'array'),
  notification_settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.contact_forms (id),
  form_slug text not null,
  locale text not null default 'es' check (locale in ('es', 'en')),
  name text not null,
  email text not null,
  company text,
  category text,
  message text not null,
  answers jsonb not null default '{}'::jsonb,
  adult_consent boolean not null default false,
  privacy_consent boolean not null default false,
  privacy_notice_version text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'archived')),
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed')),
  email_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);
create index if not exists contact_submissions_status_idx
  on public.contact_submissions (status, created_at desc);
create index if not exists contact_submissions_form_slug_idx
  on public.contact_submissions (form_slug, created_at desc);

create table if not exists public.analytics_daily (
  day date not null,
  event_name text not null,
  path text not null,
  locale text not null check (locale in ('es', 'en')),
  event_count bigint not null default 0 check (event_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (day, event_name, path, locale)
);

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
  if p_event_name not in ('page_view', 'contact_submit', 'book_view', 'book_purchase_click', 'video_play', 'character_view', 'map_destination_open', 'song_play', 'wallpaper_download') then
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

alter table public.admin_profiles enable row level security;
alter table public.contact_forms enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.analytics_daily enable row level security;

revoke all on public.admin_profiles from anon, authenticated;
revoke all on public.contact_forms from anon, authenticated;
revoke all on public.contact_submissions from anon, authenticated;
revoke all on public.analytics_daily from anon, authenticated;
grant select on public.admin_profiles to authenticated;
grant all on public.admin_profiles, public.contact_forms, public.contact_submissions, public.analytics_daily to service_role;

create policy "Admins can read their own profile"
  on public.admin_profiles for select to authenticated
  using (auth.uid() = user_id);

revoke all on function public.record_public_analytics(text, text, text) from public, anon, authenticated;
grant execute on function public.record_public_analytics(text, text, text) to service_role;

insert into public.contact_forms (slug, title, description, enabled, fields, notification_settings)
values (
  'contact',
  '{"es":"Contacto","en":"Contact"}'::jsonb,
  '{"es":"Para consultas editoriales, prensa, colaboraciones, educación y familias.","en":"For publishing, press, partnership, education and family enquiries."}'::jsonb,
  true,
  '[
    {"key":"name","type":"text","system":"name","required":true,"maxLength":120,"label":{"es":"Nombre","en":"Name"}},
    {"key":"email","type":"email","system":"email","required":true,"maxLength":320,"label":{"es":"Correo electrónico","en":"Email address"}},
    {"key":"company","type":"text","system":"company","required":false,"maxLength":160,"label":{"es":"Organización","en":"Organization"}},
    {"key":"country","type":"text","system":"country","required":false,"maxLength":120,"label":{"es":"País","en":"Country"}},
    {"key":"category","type":"select","system":"category","required":true,"label":{"es":"Motivo de contacto","en":"Reason for contact"},"options":[
      {"value":"general","label":{"es":"Consulta general","en":"General enquiry"}},
      {"value":"editorial","label":{"es":"Editorial y derechos de publicación","en":"Publishing and rights"}},
      {"value":"licensing","label":{"es":"Licencias y colaboraciones","en":"Licensing and partnerships"}},
      {"value":"press","label":{"es":"Prensa y comunicación","en":"Press and media"}},
      {"value":"education","label":{"es":"Centros educativos","en":"Education"}},
      {"value":"events","label":{"es":"Eventos y charlas","en":"Events and talks"}}
    ]},
    {"key":"message","type":"textarea","system":"message","required":true,"maxLength":10000,"label":{"es":"Mensaje","en":"Message"}},
    {"key":"adultConsent","type":"checkbox","system":"adultConsent","required":true,"label":{"es":"Confirmo que soy una persona adulta.","en":"I confirm that I am an adult."}},
    {"key":"privacyConsent","type":"checkbox","system":"privacyConsent","required":true,"label":{"es":"Acepto la política de privacidad.","en":"I accept the privacy policy."}}
  ]'::jsonb,
  '{}'::jsonb
)
on conflict (slug) do nothing;
