import type { CollectionConfig } from 'payload'

export const FormResponse: CollectionConfig = {
  slug: 'formResponse',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the project, e.g. Encapsulate',
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
      required: true,
    },
    {
      name: 'availableResources',
      type: 'textarea',
      required: true,
    },
    {
      name: 'futureConsideration',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'questionResponses',
      type: 'array',
      required: false,
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
