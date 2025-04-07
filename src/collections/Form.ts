import type { CollectionConfig } from 'payload'

export const Form: CollectionConfig = {
  slug: 'form',
  access: {},
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'clients',
      type: 'relationship',
      relationTo: 'user',
      hasMany: true,
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
      name: 'questions',
      type: 'relationship',
      relationTo: 'formQuestion',
      hasMany: true,
    },
  ],
}
