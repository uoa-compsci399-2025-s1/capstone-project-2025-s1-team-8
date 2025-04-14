import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/AdminAccess'

export const Semester: CollectionConfig = {
  slug: 'semester',
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'semesterProject',
      required: true,
    },
    {
      name: 'deadline',
      type: 'date',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
    },
  ],
}
