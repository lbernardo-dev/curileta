begin;

update public.site_events as event
set campaign_content = jsonb_set(
  event.campaign_content,
  '{activities}',
  coalesce((
    select jsonb_agg(
      case when activity.value->>'id' = 'mascaras-y-coloreo'
        then activity.value || jsonb_build_object(
          'title', jsonb_build_object(
            'es', 'Máscaras de Curileta y Pompón',
            'en', 'Curileta and Pompón masks'
          ),
          'description', jsonb_build_object(
            'es', 'Elige un personaje y descarga su máscara en PDF para imprimirla, recortarla y jugar en familia.',
            'en', 'Choose a character and download its mask as a PDF to print, cut out, and play together.'
          )
        )
        else activity.value
      end
      order by activity.ordinality
    )
    from jsonb_array_elements(coalesce(event.campaign_content->'activities', '[]'::jsonb))
      with ordinality as activity(value, ordinality)
  ), '[]'::jsonb),
  true
),
updated_at = now()
where event.slug = 'halloween'
  and exists (
    select 1
    from jsonb_array_elements(coalesce(event.campaign_content->'activities', '[]'::jsonb)) as activity(value)
    where activity.value->>'id' = 'mascaras-y-coloreo'
  );

commit;
