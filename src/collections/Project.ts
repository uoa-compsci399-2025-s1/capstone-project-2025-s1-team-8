import type { CollectionConfig } from 'payload'

export const Project: CollectionConfig = {
  slug: 'project',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'clients',
      relationTo: 'user',
      type: 'relationship',
      hasMany: true,
      required: true,
      minRows: 1,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'media', // placeholder for attachments
      hasMany: true,
      maxRows: 5,
    },
    {
      name: 'deadline',
      type: 'date',
      timezone: true,
      required: false,
    },
    {
      name: 'timestamp',
      type: 'date',
      timezone: true,
      required: true,
    },
  ],
}
