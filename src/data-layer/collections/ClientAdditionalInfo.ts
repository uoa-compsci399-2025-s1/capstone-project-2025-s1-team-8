import type { CollectionConfig } from 'payload'
import { adminOnlyAccess } from '@/business-layer/access/access'

export const ClientAdditionalInfo: CollectionConfig = {
  slug: 'clientAdditionalInfo',
  access: adminOnlyAccess,
  fields: [
    {
      name: 'client',
      relationTo: 'user',
      type: 'relationship',
      required: true,
    },
    {
      name: 'description',
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
