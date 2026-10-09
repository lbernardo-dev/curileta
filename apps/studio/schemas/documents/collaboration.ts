import { defineType, defineField } from 'sanity';

export const collaboration = defineType({
  name: 'collaboration',
  title: 'Alianzas y Colaboraciones',
  type: 'document',
  icon: () => '🤝',
  fields: [
    defineField({
      name: 'brand',
      title: 'Nombre de la Marca / Entidad',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Título del Proyecto',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Identificador URL (Slug)',
      type: 'slug',
      options: {
        source: 'brand',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Editorial', value: 'editorial' },
          { title: 'Licensing & Merch', value: 'licensing' },
          { title: 'Educación & Colegios', value: 'education' },
          { title: 'Medios & Festivales', value: 'media' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logotipo de la Entidad',
      type: 'image',
    }),
    defineField({
      name: 'description',
      title: 'Descripción del Proyecto',
      type: 'localizedText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Destacar en portada',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'brand',
      subtitle: 'category',
      media: 'logo',
    },
  },
});
