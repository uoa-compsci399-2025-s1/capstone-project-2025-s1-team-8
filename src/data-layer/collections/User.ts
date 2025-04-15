import type { CollectionConfig } from 'payload'
import { adminOnlyAccess } from '@/business-layer/access/access'
import { UserRole } from '@/types/user'

export const User: CollectionConfig = {
  slug: 'user',
  auth: true,
  access: adminOnlyAccess,
  fields: [
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
