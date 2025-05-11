import type { CollectionConfig } from 'payload'

export const Form: CollectionConfig = {
  slug: 'form',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The form name',
      },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      admin: {
        description: 'The form description',
      },
    },
  ],
}
