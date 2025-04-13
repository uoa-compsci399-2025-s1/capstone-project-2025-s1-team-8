import type { CollectionConfig } from 'payload'
import { Role } from '@/types/RoleTypes'
import { admin } from '@/access/AdminAccess'

export const User: CollectionConfig = {
  slug: 'user',
  auth: true,
  access: {
    read: admin,
    create: admin,
    update: admin,
    delete: admin,
  },
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
      options: Object.values(Role),
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
