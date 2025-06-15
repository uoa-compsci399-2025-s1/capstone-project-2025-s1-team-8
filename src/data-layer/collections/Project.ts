import type { CollectionConfig } from 'payload'

export const Project: CollectionConfig = {
  slug: 'project',
  admin: {
    useAsTitle: 'name',
  },
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
      name: 'additionalClients',
      relationTo: 'user',
      type: 'relationship',
      hasMany: true,
      required: false,
      minRows: 1,
      admin: {
        description: 'The clients that are related to this project.',
      },
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
      name: 'desiredOutput',
      type: 'textarea',
      required: true,
    },
    {
      name: 'specialEquipmentRequirements',
      type: 'textarea',
      required: true,
    },
    {
      name: 'numberOfTeams',
      type: 'text',
      required: true,
    },
    {
      name: 'desiredTeamSkills',
      type: 'textarea',
      required: false,
    },
    {
      name: 'availableResources',
      type: 'textarea',
      required: false,
    },
  ],
}
