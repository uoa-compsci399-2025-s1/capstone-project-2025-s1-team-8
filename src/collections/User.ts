import type { CollectionConfig } from 'payload'
import { Role } from '@/types/RoleTypes'
import { adminOnlyAccess } from '@/access/AdminOnly'

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
