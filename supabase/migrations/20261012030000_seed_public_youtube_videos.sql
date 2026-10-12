-- Preserve the currently published YouTube catalogue in the Supabase CMS before cutover.
-- The seed is idempotent and never overwrites a video already managed in the admin panel.
begin;

do $$
begin
  if to_regclass('public.managed_content_entries') is null then
    raise exception 'managed_content_entries is missing; apply the managed editorial content migration first';
  end if;
end;
$$;

insert into public.managed_content_entries
  (content_type, content_id, slug, payload, sort_order, is_published, is_deleted)
values
  (
    'video',
    'curileta-cap-1-el-mundo-no-cabe-en-un-solo-arbol',
    'curileta-cap-1-el-mundo-no-cabe-en-un-solo-arbol',
    jsonb_build_object(
      'id', 'curileta-cap-1-el-mundo-no-cabe-en-un-solo-arbol',
      'slug', 'curileta-cap-1-el-mundo-no-cabe-en-un-solo-arbol',
      'youtubeId', 'mFOrs8Ear38',
      'title', jsonb_build_object(
        'es', 'Curileta | Cap. 1: El mundo no cabe en un solo árbol',
        'en', 'Curileta | Ep. 1: The world is bigger than one tree'
      ),
      'thumbnail', 'https://i.ytimg.com/vi/mFOrs8Ear38/hqdefault.jpg',
      'type', 'episode',
      'description', jsonb_build_object(
        'es', $episode_es$Curileta sueña con descubrir qué hay más allá de su bosque encantado, y hoy comienza su gran viaje. 🌍🦎 Capítulo 1 de Las Aventuras de Curileta: una despedida emotiva y muchas ganas de explorar. Curileta vive feliz en su bosque encantado, pero siente que el mundo es demasiado grande como para quedarse siempre en el mismo sitio. Tras compartir un momento especial con su amigo Pompón, comprende que ha llegado la hora de salir a explorar. Con un poco de nostalgia y mucha ilusión, se despide y comienza su viaje. ✨ En este capítulo: - Conocemos a Curileta, una pequeña lagartija verde, curiosa y alegre. - Visitamos su bosque encantado, el hogar que tanto quiere. - Compartimos un momento especial con Pompón, su amigo conejo. - Curileta decide salir a descubrir nuevos lugares, animales y culturas. - Idea central: atreverse a descubrir el mundo sin olvidar a los amigos ni el lugar del que venimos. 👨‍👩‍👧 Para las familias: Las Aventuras de Curileta es una serie animada original en español, apta para ver en familia. 🔔 Suscríbete para acompañar a Curileta en su vuelta al mundo: https://www.youtube.com/@AventurasdeCurileta?sub_confirmation=1 ▶️ Próximo capítulo: Nos vamos a México! ▶️ Lista de reproducción (Temporada 1): https://www.youtube.com/playlist?list=PLCwCIlxO526U 📖 Conoce el libro en el que se basa la serie: https://amzn.eu/d/0ekROo5F #Curileta #LasAventurasdeCurileta #BosqueEncantado$episode_es$,
        'en', $episode_en$Curileta dreams of discovering what lies beyond her enchanted forest, and today her great journey begins. 🌍🦎 Episode 1 of The Adventures of Curileta: an emotional goodbye and a strong desire to explore. Curileta is happy in her enchanted forest, but feels the world is too big to stay in one place forever. After sharing a special moment with her friend Pompón, she realizes it is time to set off and explore. With a little nostalgia and a lot of excitement, she says goodbye and begins her journey. ✨ In this episode: - Meet Curileta, a curious and cheerful little green lizard. - Visit her enchanted forest, the home she loves. - Share a special moment with Pompón, her bunny friend. - Curileta sets out to discover new places, animals, and cultures. - The idea: explore the world without forgetting our friends or where we come from. 👨‍👩‍👧 For families: The Adventures of Curileta is an original animated series in Spanish, suitable for the whole family. 🔔 Subscribe to join Curileta around the world: https://www.youtube.com/@AventurasdeCurileta?sub_confirmation=1 ▶️ Next episode: We are going to Mexico! ▶️ Season 1 playlist: https://www.youtube.com/playlist?list=PLCwCIlxO526U 📖 Discover the book behind the series: https://amzn.eu/d/0ekROo5F #Curileta #LasAventurasdeCurileta #BosqueEncantado$episode_en$
      ),
      'duration', '8:11',
      'publishedAt', '2026-10-11T00:00:00.000Z',
      'episodeNumber', 1,
      'playlistName', jsonb_build_object('es', 'Temporada 1', 'en', 'Season 1'),
      'playlistId', 'PLCwCIlxO526U',
      'tags', jsonb_build_array(
        'Curileta', 'Las Aventuras de Curileta', 'Pompón', 'serie animada',
        'serie animada en español', 'dibujos animados en español',
        'dibujos animados para niños', 'cuentos para niños', 'bosque encantado',
        'aventuras para niños', 'exploradora', 'lagartija', 'amistad',
        'serie para ver en familia'
      ),
      'isPublished', true
    ),
    0,
    true,
    false
  ),
  (
    'video',
    'conoce-a-curileta-la-curiosa-exploradora',
    'conoce-a-curileta-la-curiosa-exploradora',
    jsonb_build_object(
      'id', 'conoce-a-curileta-la-curiosa-exploradora',
      'slug', 'conoce-a-curileta-la-curiosa-exploradora',
      'youtubeId', 'SXs2jss-guI',
      'title', jsonb_build_object(
        'es', 'Conoce a Curileta, la curiosa exploradora',
        'en', 'Meet Curileta, the curious explorer'
      ),
      'thumbnail', 'https://i.ytimg.com/vi/SXs2jss-guI/hqdefault.jpg',
      'type', 'short',
      'description', jsonb_build_object(
        'es', $short_es$Una pequeña exploradora viaja por lugares reales del mundo y escribe cartas a su amigo, el conejito. 🌍✉️ Serie animada original en español, para ver en familia. El primer capítulo llega muy pronto. #Shorts #Curileta #LasAventurasdeCurileta$short_es$,
        'en', $short_en$A little explorer travels to real places around the world and writes letters to her friend, the little bunny. 🌍✉️ An original animated series in Spanish for the whole family. The first episode is coming soon. #Shorts #Curileta #LasAventurasdeCurileta$short_en$
      ),
      'duration', '1:01',
      'publishedAt', '2026-10-10T00:00:00.000Z',
      'tags', jsonb_build_array(
        'Curileta', 'Las Aventuras de Curileta', 'serie animada',
        'serie animada en español', 'dibujos animados en español',
        'dibujos animados para niños', 'cuentos para niños',
        'viajes alrededor del mundo', 'vuelta al mundo', 'exploradora',
        'lagartija', 'aventuras para niños', 'animación 3D',
        'serie para ver en familia'
      ),
      'isPublished', true
    ),
    1,
    true,
    false
  )
on conflict (content_type, content_id) do nothing;

commit;
