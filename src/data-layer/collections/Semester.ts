import type { CollectionConfig } from 'payload'

export const Semester: CollectionConfig = {
  slug: 'semester',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Description of the semester',
      },
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
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        description: 'A state if all the approved projects are published or not. ',
      },
    },
  ],
}
