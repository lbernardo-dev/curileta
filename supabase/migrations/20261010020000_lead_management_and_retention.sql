alter table public.contact_submissions
  add column if not exists resolved_at timestamptz,
  add column if not exists lead_stage text,
  add column if not exists lead_notes text not null default '';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'contact_submissions_lead_stage_check'
      and conrelid = 'public.contact_submissions'::regclass
  ) then
    alter table public.contact_submissions
      add constraint contact_submissions_lead_stage_check
      check (lead_stage is null or lead_stage in ('new', 'contacted', 'qualified', 'won', 'lost'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'contact_submissions_lead_notes_length_check'
      and conrelid = 'public.contact_submissions'::regclass
  ) then
    alter table public.contact_submissions
      add constraint contact_submissions_lead_notes_length_check
      check (char_length(lead_notes) <= 4000);
  end if;
end;
$$;

-- Give already closed submissions a fresh 30 day period when this policy is first installed.
update public.contact_submissions
set resolved_at = now()
where status in ('resolved', 'archived')
  and resolved_at is null;

create index if not exists contact_submissions_leads_idx
  on public.contact_submissions (lead_stage, created_at desc)
  where lead_stage is not null;

create index if not exists contact_submissions_retention_idx
  on public.contact_submissions (resolved_at)
  where status in ('resolved', 'archived') and lead_stage is null;

create or replace function public.track_contact_submission_resolution()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.status in ('resolved', 'archived') then
    if tg_op = 'INSERT' then
      new.resolved_at := now();
    elsif old.status not in ('resolved', 'archived') then
      new.resolved_at := now();
    else
      new.resolved_at := coalesce(old.resolved_at, new.resolved_at, now());
    end if;
  else
    new.resolved_at := null;
  end if;

  if tg_op = 'UPDATE' then
    new.updated_at := now();
  end if;

  return new;
end;
$$;

drop trigger if exists contact_submissions_track_resolution on public.contact_submissions;
create trigger contact_submissions_track_resolution
  before insert or update on public.contact_submissions
  for each row execute function public.track_contact_submission_resolution();

create or replace function public.purge_expired_contact_submissions()
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  deleted_rows bigint;
begin
  delete from public.contact_submissions
  where status in ('resolved', 'archived')
    and lead_stage is null
    and resolved_at < now() - interval '30 days';

  get diagnostics deleted_rows = row_count;
  return deleted_rows;
end;
$$;

revoke all on function public.track_contact_submission_resolution() from public, anon, authenticated;
revoke all on function public.purge_expired_contact_submissions() from public, anon, authenticated;

create extension if not exists pg_cron;

do $$
declare
  existing_job record;
begin
  for existing_job in
    select jobid from cron.job where jobname = 'contact-submission-retention'
  loop
    perform cron.unschedule(existing_job.jobid);
  end loop;

  perform cron.schedule(
    'contact-submission-retention',
    '0 3 * * *',
    'select public.purge_expired_contact_submissions();'
  );
end;
$$;
