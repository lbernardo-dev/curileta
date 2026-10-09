import { defineType, defineField } from 'sanity';

export const book = defineType({
  name: 'book',
  title: 'Libros',
  type: 'document',
  icon: () => '📖',
  fields: [
    defineField({
      name: 'title',
      title: 'Título del Libro',
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
      name: 'volume',
      title: 'Número de Volumen / Colección',
      type: 'string',
      placeholder: 'Ej: Volumen 1',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'localizedString',
    }),
    defineField({
      name: 'coverImage',
      title: 'Portada Oficial del Libro',
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
      name: 'description',
      title: 'Sinopsis / Descripción Editorial',
      type: 'localizedText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ageRange',
      title: 'Rango de Edad Recomendado',
      type: 'string',
      placeholder: 'Ej: 5–10 años',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageCount',
      title: 'Número de Páginas',
      type: 'number',
    }),
    defineField({
      name: 'publicationDate',
      title: 'Fecha de Publicación',
      type: 'date',
    }),
    defineField({
      name: 'isbn',
      title: 'ISBN',
      type: 'string',
    }),
    defineField({
      name: 'publisher',
      title: 'Editorial',
      type: 'string',
      initialValue: 'Curileta Publishing',
    }),
    defineField({
      name: 'purchaseLinks',
      title: 'Puntos de Venta y Enlaces de Compra',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'storeName', title: 'Nombre de la Tienda / Librería', type: 'string' },
            { name: 'url', title: 'Enlace Web Oficial de Compra', type: 'url' },
          ],
        },
      ],
    }),
    defineField({
      name: 'characters',
      title: 'Personajes que aparecen en la historia',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'character' }] }],
    }),
    defineField({
      name: 'locations',
      title: 'Destinos y Países visitados en el libro',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'location' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'title.es',
      subtitle: 'volume',
      media: 'coverImage',
    },
  },
});
