import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración General del Sitio',
  type: 'document',
  icon: () => '⚙️',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre de la Marca',
      type: 'string',
      initialValue: 'Las Aventuras de Curileta',
    }),
    defineField({
      name: 'youtubeChannelUrl',
      title: 'URL del Canal de YouTube',
      type: 'url',
      initialValue: 'https://www.youtube.com/@curileta',
    }),
    defineField({
      name: 'featureFlags',
      title: 'Interruptores de Funcionalidad (Feature Flags)',
      type: 'object',
      fields: [
        {
          name: 'storeEnabled',
          title: 'Activar Tienda Online (/tienda)',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'songsEnabled',
          title: 'Activar Sección de Canciones (/canciones)',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'eventsEnabled',
          title: 'Activar Calendario de Eventos (/eventos)',
          type: 'boolean',
          initialValue: false,
        },
      ],
    }),
  ],
});
