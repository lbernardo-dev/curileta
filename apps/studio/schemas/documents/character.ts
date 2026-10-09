import { defineType, defineField } from 'sanity';

export const character = defineType({
  name: 'character',
  title: 'Personajes',
  type: 'document',
  icon: () => '🧭',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre del Personaje',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Identificador URL (Slug)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'species',
      title: 'Especie / Rol en el Universo',
      type: 'string',
      placeholder: 'Ej: Conejo del Bosque, Ave sagrada...',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descripción Corta',
      type: 'localizedText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'biography',
      title: 'Biografía Completa',
      type: 'localizedText',
    }),
    defineField({
      name: 'quote',
      title: 'Frase Representativa',
      type: 'localizedString',
    }),
    defineField({
      name: 'personality',
      title: 'Rasgos de Personalidad',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'values',
      title: 'Valores que transmite',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'mainImage',
      title: 'Ilustración Principal Oficial',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto Alternativo (Accesibilidad)',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de Poses y Expresiones',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'relatedBooks',
      title: 'Libros en los que aparece',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'book' }] }],
    }),
    defineField({
      name: 'relatedLocations',
      title: 'Lugares y Países que visita',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'location' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'species',
      media: 'mainImage',
    },
  },
});
