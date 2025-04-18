import { adminOnlyAccess } from '@/business-layer/access/access'
import type { CollectionConfig } from 'payload'

export const FormResponse: CollectionConfig = {
  slug: 'formResponse',
  access: adminOnlyAccess,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'clients',
      type: 'relationship',
      relationTo: 'user',
      hasMany: true,
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
      name: 'questionResponses',
      type: 'array',
      fields: [
        {
          name: 'question',
          type: 'relationship',
          relationTo: 'formQuestion',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
