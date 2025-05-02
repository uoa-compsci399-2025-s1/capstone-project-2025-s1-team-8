import type { CollectionConfig } from 'payload'

export const FormResponse: CollectionConfig = {
  slug: 'formResponse',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the project, e.g. Encapsulate',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The description of the project, e.g. Best capstone project!',
      },
    },
    {
      name: 'client',
      type: 'relationship',
      required: true,
      relationTo: 'user',
      admin: {
        description: 'The client that submitted the form',
      },
    },
    {
      name: 'otherClients',
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

        const nonClients = users.docs.filter((user) => !['admin', 'client'].includes(user.role))

        if (nonClients.length > 0) {
          const names = nonClients.map((u) => `${u.firstName} ${u.lastName}`).join(', ')
          return `The following users are not clients: ${names}`
        }
        return true
      },
      admin: {
        description: 'The clients that are related to this project.',
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
