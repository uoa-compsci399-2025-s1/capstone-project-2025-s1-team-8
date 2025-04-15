import type { CollectionConfig } from 'payload'
import { adminOnlyAccess } from '@/business-layer/access/access'

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
