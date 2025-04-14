import type { CollectionConfig } from 'payload'
import { adminOnlyAccess } from '@/collections/access/AdminOnly'

export const Form: CollectionConfig = {
  slug: 'form',
  access: adminOnlyAccess,
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
