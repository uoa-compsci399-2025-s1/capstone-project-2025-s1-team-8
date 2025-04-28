import type { CollectionConfig } from 'payload'

export const FormQuestion: CollectionConfig = {
  slug: 'formQuestion',
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
  ],
}
