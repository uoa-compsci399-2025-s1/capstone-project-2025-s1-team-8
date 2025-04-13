import type { CollectionConfig } from 'payload'
import { admin } from '@/access/AdminAccess'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: admin,
    create: admin,
    update: admin,
    delete: admin,
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
