import type { CollectionConfig } from 'payload'
import { adminOnlyAccess } from '@/collections/access/AdminOnly'

export const FormQuestion: CollectionConfig = {
  slug: 'formQuestion',
  access: adminOnlyAccess,
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
  ],
}
