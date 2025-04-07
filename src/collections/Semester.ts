import type { CollectionConfig } from 'payload'

export const Semester: CollectionConfig = {
  slug: 'semester',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    // {
    //   name: 'projects',
    //   type: 'relationship',
    //   relationTo: 'projects',
    //   required: true,
    // },
    {
      name: 'deadline',
      type: 'date',
      timezone: true,
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      timezone: true,
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      timezone: true,
      required: true,
    },
  ],
}
