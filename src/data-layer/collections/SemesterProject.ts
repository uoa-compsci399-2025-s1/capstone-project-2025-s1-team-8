import type { CollectionConfig } from 'payload'
import { adminOnlyAccess } from '@/business-layer/access/access'
import { ProjectStatus } from '@/types/Project'

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
      defaultValue: ProjectStatus.Pending,
      options: Object.values(ProjectStatus),
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
