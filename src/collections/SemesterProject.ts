import { Status } from '@/types/StatusTypes'
import type { CollectionConfig } from 'payload'
import { adminOnlyAccess } from '@/access/AdminOnly'

export const SemesterProject: CollectionConfig = {
  slug: 'semesterProject',
  access: adminOnlyAccess,
  fields: [
    {
      name: 'number',
      type: 'number',
      required: false,
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'project',
      required: true,
    },
    {
      name: 'semester',
      type: 'relationship',
      relationTo: 'semester',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: Status.Pending,
      options: Object.values(Status),
      required: true,
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      required: true,
    },
  ],
}
