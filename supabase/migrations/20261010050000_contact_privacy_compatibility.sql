-- Keep the system key recognized by the currently published website until
-- a deployment with legacy-key compatibility is released. The label remains
-- an acknowledgment that the privacy information was read, not consent.
update public.contact_forms as forms
set fields = (
  select jsonb_agg(
    case
      when field_data->>'system' = 'privacyAcknowledgement' then
        field_data || jsonb_build_object('system', 'privacyConsent')
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
    where field_data->>'system' = 'privacyAcknowledgement'
  );
