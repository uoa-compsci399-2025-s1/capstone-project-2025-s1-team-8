import type { CollectionConfig } from 'payload'
import { admin } from '@/access/AdminAccess'

export const FormQuestion: CollectionConfig = {
  slug: 'formQuestion',
  access: {
    read: admin,
    create: admin,
    update: admin,
    delete: admin,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
  ],
}
