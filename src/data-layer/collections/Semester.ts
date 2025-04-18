import type { CollectionConfig } from 'payload'
import { adminOnlyAccess } from '@/business-layer/access/access'

export const Semester: CollectionConfig = {
  slug: 'semester',
  access: adminOnlyAccess,
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
      hasMany: true,
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
