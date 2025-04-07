import type { CollectionConfig } from 'payload'

export const FormQuestion: CollectionConfig = {
  slug: 'formQuestion',
  access: {},
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
  ],
}
