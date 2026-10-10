import { defineField, defineType } from 'sanity';

const sectionKeys = [
  { title: 'Portada', value: 'hero' },
  { title: 'Evento estacional', value: 'seasonalEvent' },
  { title: 'Historia', value: 'story' },
  { title: 'Globo', value: 'globe' },
  { title: 'Radar de aventuras', value: 'radar' },
  { title: 'Cartas', value: 'letters' },
  { title: 'Personajes', value: 'characters' },
  { title: 'Libros', value: 'books' },
  { title: 'Vídeos', value: 'videos' },
  { title: 'Fondos de pantalla', value: 'wallpapers' },
  { title: 'Próximamente', value: 'roadmap' },
  { title: 'Colaboraciones', value: 'collaborations' },
  { title: 'Cierre', value: 'closing' },
];

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', title: 'Nombre del sitio', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'heroTagline', title: 'Frase principal', type: 'localizedString' }),
    defineField({ name: 'heroSubtitle', title: 'Descripción principal', type: 'localizedString' }),
    defineField({ name: 'totalCountriesCount', title: 'Países explorados', type: 'number' }),
    defineField({ name: 'totalCharactersCount', title: 'Personajes', type: 'number' }),
    defineField({ name: 'totalBooksCount', title: 'Libros publicados', type: 'number' }),
    defineField({ name: 'featuredQuote', title: 'Frase destacada', type: 'localizedString' }),
    defineField({
      name: 'statsBadges',
      title: 'Indicadores de la portada',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'icon', title: 'Icono', type: 'string' },
          { name: 'label', title: 'Etiqueta', type: 'localizedString' },
          { name: 'value', title: 'Valor', type: 'string' },
        ],
      }],
    }),
    defineField({
      name: 'homepageSections',
      title: 'Secciones de la portada',
      description: 'Cambia el orden o la visibilidad de las secciones de la página principal.',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'key', title: 'Sección', type: 'string', options: { list: sectionKeys }, validation: (Rule) => Rule.required() },
          { name: 'visible', title: 'Visible', type: 'boolean', initialValue: true },
          { name: 'order', title: 'Orden', type: 'number', validation: (Rule) => Rule.required().integer().min(0) },
        ],
        preview: { select: { title: 'key', subtitle: 'order' } },
      }],
    }),
  ],
  preview: { prepare: () => ({ title: 'Configuración del sitio' }) },
});
