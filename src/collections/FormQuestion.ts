import type { CollectionConfig } from 'payload'

export const FormQuestion: CollectionConfig = {
  slug: 'formQuestion',
  access: {},
  fields: [
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
  ],
}
