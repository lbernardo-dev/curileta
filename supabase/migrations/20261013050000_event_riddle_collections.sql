begin;

-- Halloween has one compact riddle activity with a navigable, bilingual collection.
-- Replacing this stable activity id makes the migration safe to reapply without duplicates.
update public.site_events as event
set campaign_content = jsonb_set(
  event.campaign_content,
  '{activities}',
  coalesce((
    select jsonb_agg(activity.value order by activity.ordinality)
    from jsonb_array_elements(coalesce(event.campaign_content->'activities', '[]'::jsonb))
      with ordinality as activity(value, ordinality)
    where activity.value->>'id' is distinct from 'acertijo-luna'
  ), '[]'::jsonb) || jsonb_build_array(
    '{
      "id":"acertijos-de-halloween",
      "kind":"riddleSet",
      "icon":"🌙",
      "title":{"es":"El acertijo de la luna","en":"The moonlit riddles"},
      "description":{"es":"Resuelve tres misterios del bosque y avanza de uno en uno.","en":"Solve three forest mysteries, one at a time."},
      "reveal":{"es":"","en":""},
      "resourceUrl":"",
      "resourcePath":"",
      "riddles":[
        {"id":"luna-redonda","title":{"es":"La luna viajera","en":"The wandering moon"},"prompt":{"es":"Por la noche aparezco y cambio de forma. A veces soy una sonrisa y otras, un círculo brillante. ¿Quién soy?","en":"I appear at night and change my shape. Sometimes I am a smile, and sometimes a bright circle. What am I?"},"answer":{"es":"La luna. Sus distintas fases nos acompañan mientras Curileta explora el bosque.","en":"The moon. Its changing phases keep Curileta company as she explores the forest."}},
        {"id":"calabaza-luminosa","title":{"es":"La calabaza luminosa","en":"The glowing pumpkin"},"prompt":{"es":"Soy naranja y guardo semillas. Cuando llega la noche, una sonrisa recortada puede iluminar mi cara. ¿Qué soy?","en":"I am orange and full of seeds. When night comes, a carved smile can light up my face. What am I?"},"answer":{"es":"Una calabaza. Con ayuda de una persona adulta, puede convertirse en un farol para decorar el camino.","en":"A pumpkin. With an adult’s help, it can become a lantern to decorate the path."}},
        {"id":"alas-de-la-noche","title":{"es":"Las alas silenciosas","en":"Silent wings"},"prompt":{"es":"Vuelo cuando oscurece, descanso boca abajo y uso sonidos para orientarme. ¿Qué animal soy?","en":"I fly after sunset, rest upside down and use sounds to find my way. What animal am I?"},"answer":{"es":"Un murciélago. Es un animal nocturno que ayuda a la naturaleza y merece que cuidemos su hogar.","en":"A bat. It is a nocturnal animal that helps nature and deserves a safe home."}}
      ]
    }'::jsonb
  ),
  true
), updated_at = now()
where event.slug = 'halloween'
  and jsonb_typeof(event.campaign_content) = 'object';

commit;
