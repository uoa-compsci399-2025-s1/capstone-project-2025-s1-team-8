import type { CollectionConfig } from 'payload'

export const Form: CollectionConfig = {
    slug: 'form',
    access: {},
    fields: [
      {
        name: 'id',
        type: 'text',
        required: true,
      },
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'clients',
        type: 'relationship',
        relationTo: 'user',
        hasMany: true,
      },
      {
        name: 'questions',
        type: 'relationship',
        relationTo: 'formQuestion',
        hasMany: true,
      },
    ],
  }
  