import type { CollectionConfig } from 'payload'

export const FormResponse: CollectionConfig = {
  slug: 'formResponse',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'clients',
      type: 'relationship',
      relationTo: 'user',
      hasMany: true,
      minRows: 1,
    },
    {
      name: 'questionResponses',
      type: 'array',
      fields: [
        {
          name: 'question',
          type: 'relationship',
          relationTo: 'formQuestion',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
