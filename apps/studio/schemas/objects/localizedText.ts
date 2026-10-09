import { defineType, defineField } from 'sanity';

export const localizedText = defineType({
  name: 'localizedText',
  title: 'Párrafo Localizado',
  type: 'object',
  fieldsets: [
    {
      title: 'Traducciones',
      name: 'translations',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: 'es',
      title: 'Español (Principal)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'Inglés',
      type: 'text',
      rows: 4,
      fieldset: 'translations',
    }),
  ],
});
