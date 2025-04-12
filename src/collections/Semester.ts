import type { CollectionConfig } from 'payload'

export const Semester: CollectionConfig = {
  slug: 'semester',
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
