import type { CollectionConfig } from 'payload'

export const Form: CollectionConfig = {
  slug: 'form',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
    },
    {
      name: 'questions',
      type: 'relationship',
      relationTo: 'formQuestion',
      hasMany: true,
    },
  ],
}
