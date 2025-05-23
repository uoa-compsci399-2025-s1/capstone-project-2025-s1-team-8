import type { CollectionConfig } from 'payload'

export const ClientAdditionalInfo: CollectionConfig = {
  slug: 'clientAdditionalInfo',
  fields: [
    {
      name: 'client',
      relationTo: 'user',
      type: 'relationship',
      required: true,
    },
    {
      name: 'introduction',
      type: 'text',
      required: false,
    },
    {
      name: 'affiliation',
      type: 'text',
      required: false,
    },
  ],
}
