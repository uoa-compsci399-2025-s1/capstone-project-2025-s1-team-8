import type { CollectionConfig } from 'payload'
import { ProjectStatus } from '@/types/Project'

export const SemesterProject: CollectionConfig = {
  slug: 'semesterProject',
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
      defaultValue: ProjectStatus.Pending,
      options: Object.values(ProjectStatus),
      required: true,
    },
  ],
}
