import { defineType, defineField } from 'sanity';

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Texto Localizado',
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
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'Inglés',
      type: 'string',
      fieldset: 'translations',
    }),
  ],
});
