import type { CollectionConfig } from 'payload'
import { adminOnlyAccess } from '@/collections/access/AdminOnly'

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
