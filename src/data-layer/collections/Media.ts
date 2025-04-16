import type { CollectionConfig } from 'payload'
import { adminOnlyAccess } from '@/business-layer/access/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: adminOnlyAccess,
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
