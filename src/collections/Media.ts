import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/AdminAccess'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
