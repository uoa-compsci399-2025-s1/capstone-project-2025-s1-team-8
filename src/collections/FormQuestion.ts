import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/AdminAccess'

export const FormQuestion: CollectionConfig = {
  slug: 'formQuestion',
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
  ],
}
