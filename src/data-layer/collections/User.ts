import type { CollectionConfig } from 'payload'
import { UserRole } from '@/types/User'

export const User: CollectionConfig = {
  slug: 'user',
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: Object.values(UserRole),
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
}
