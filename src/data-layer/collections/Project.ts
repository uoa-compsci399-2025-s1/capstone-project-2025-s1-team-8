import type { CollectionConfig } from 'payload'
import { adminOnlyAccess } from '@/business-layer/access/access'

export const Project: CollectionConfig = {
  slug: 'project',
  access: adminOnlyAccess,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'clients',
      relationTo: 'user',
      type: 'relationship',
      hasMany: true,
      required: true,
      minRows: 1,
      validate: async (val, args) => {
        if (!val || val.length === 0) return true

        const clientIDs = Array.isArray(val) ? val : [val]

        const users = await args.req.payload.find({
          collection: 'user',
          where: {
            id: {
              in: clientIDs,
            },
          },
        })

        const nonClients = users.docs.filter((user) => user.role !== 'client')

        if (nonClients.length > 0) {
          const names = nonClients.map((u) => `${u.firstName} ${u.lastName}`).join(', ')
          return `The following users are not clients: ${names}`
        }
        return true
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'media', // placeholder for attachments
      hasMany: true,
      maxRows: 5,
    },
    {
      name: 'deadline',
      type: 'date',
      required: false,
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
    },
  ],
}
