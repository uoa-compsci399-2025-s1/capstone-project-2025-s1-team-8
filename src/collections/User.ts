import type { CollectionConfig } from 'payload'
import { Role } from '@/enums/RoleEnum'

export const User: CollectionConfig = {
  slug: 'user',
  auth: true,
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
      options: [
        {
          label: 'Admin',
          value: Role.Admin,
        },
        {
          label: 'Client',
          value: Role.Client,
        },
        {
          label: 'Student',
          value: Role.Student,
        },
      ],
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
