import { defineType, defineField } from 'sanity';

export const location = defineType({
  name: 'location',
  title: 'Lugares y Destinos',
  type: 'document',
  icon: () => '📍',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre del Lugar / Monumento',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Identificador URL (Slug)',
      type: 'slug',
      options: {
        source: 'name.es',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'País',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen Panorámica Oficial',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto Alternativo',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción Cultural y Geográfica',
      type: 'localizedText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'curiosities',
      title: 'Curiosidades para Niños Exploradores',
      type: 'array',
      of: [{ type: 'localizedString' }],
    }),
  ],
  preview: {
    select: {
      title: 'name.es',
      subtitle: 'country.es',
      media: 'heroImage',
    },
  },
});
