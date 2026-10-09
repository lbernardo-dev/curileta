import { defineType, defineField } from 'sanity';

export const video = defineType({
  name: 'video',
  title: 'Vídeos y Episodios',
  type: 'document',
  icon: () => '🎬',
  fields: [
    defineField({
      name: 'title',
      title: 'Título del Vídeo',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Identificador URL (Slug)',
      type: 'slug',
      options: {
        source: 'title.es',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'youtubeId',
      title: 'ID del Vídeo en YouTube',
      type: 'string',
      description: 'El identificador único de YouTube (ejemplo: dQw4w9WgXcQ)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Tipo de Contenido',
      type: 'string',
      options: {
        list: [
          { title: 'Episodio Completo', value: 'episode' },
          { title: 'Short / Corto', value: 'short' },
          { title: 'Canción / Videoclip', value: 'song' },
          { title: 'Trailer / Avance', value: 'trailer' },
        ],
      },
      initialValue: 'episode',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duración (ej: 08:45)',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de Estreno',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title.es',
      subtitle: 'type',
    },
  },
});
