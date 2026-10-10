alter table public.contact_submissions
  add column if not exists privacy_notice_acknowledged boolean not null default false,
  add column if not exists lead_last_activity_at timestamptz,
  add column if not exists lead_retention_notice_due_at timestamptz,
  add column if not exists lead_retention_notified_at timestamptz,
  add column if not exists lead_deletion_scheduled_at timestamptz;

drop trigger if exists contact_submissions_track_resolution on public.contact_submissions;

update public.contact_submissions
set lead_last_activity_at = coalesce(updated_at, created_at, now())
where lead_last_activity_at is null;

alter table public.contact_submissions
  alter column lead_last_activity_at set default now(),
  alter column lead_last_activity_at set not null;

-- Start the 30-day period when this policy is installed for already closed submissions.
update public.contact_submissions
set resolved_at = now(),
    updated_at = now()
where status in ('resolved', 'archived')
  and lead_stage is null;

create index if not exists contact_submissions_lead_retention_notice_idx
  on public.contact_submissions (lead_retention_notice_due_at)
  where lead_stage is not null and lead_retention_notified_at is null;

create index if not exists contact_submissions_lead_retention_delete_idx
  on public.contact_submissions (lead_deletion_scheduled_at)
  where lead_stage is not null and lead_deletion_scheduled_at is not null;

update public.contact_forms as forms
set fields = (
  select jsonb_agg(
    case
      when field_data->>'system' = 'privacyConsent' then
        field_data || jsonb_build_object(
          'system', 'privacyAcknowledgement',
          'label', jsonb_build_object(
            'es', 'He leído la información de privacidad.',
            'en', 'I have read the privacy information.'
          )
        )
      else field_data
    end
    order by position
  )
  from jsonb_array_elements(forms.fields) with ordinality as field_item(field_data, position)
)
where jsonb_typeof(forms.fields) = 'array'
  and exists (
    select 1
    from jsonb_array_elements(forms.fields) as field_item(field_data)
    where field_data->>'system' = 'privacyConsent'
  );

create or replace function public.track_contact_submission_resolution()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    new.lead_last_activity_at := coalesce(new.lead_last_activity_at, new.created_at, now());
  elsif new.status is distinct from old.status
    or new.lead_stage is distinct from old.lead_stage
    or new.lead_notes is distinct from old.lead_notes then
    new.lead_last_activity_at := now();
    new.lead_retention_notice_due_at := null;
    new.lead_retention_notified_at := null;
    new.lead_deletion_scheduled_at := null;
  else
    new.lead_last_activity_at := coalesce(new.lead_last_activity_at, old.lead_last_activity_at, new.created_at, now());
  end if;

  if new.status in ('resolved', 'archived') then
    if tg_op = 'INSERT' then
      new.resolved_at := now();
    elsif old.status not in ('resolved', 'archived')
      or (old.lead_stage is not null and new.lead_stage is null) then
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
  update public.contact_submissions
  set lead_retention_notice_due_at = now()
  where lead_stage is not null
    and lead_last_activity_at <= now() - interval '12 months'
    and lead_retention_notice_due_at is null;

  delete from public.contact_submissions
  where (lead_stage is not null and lead_deletion_scheduled_at <= now())
    or (
      status in ('resolved', 'archived')
      and lead_stage is null
      and resolved_at < now() - interval '30 days'
    );

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
