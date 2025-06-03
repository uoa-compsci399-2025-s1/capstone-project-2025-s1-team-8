import type { GlobalConfig } from 'payload'

export const ClientDashboard: GlobalConfig = {
  slug: 'client-dashboard',
  admin: {
    group: 'Dashboard',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'tipTitle',
      type: 'text',
      defaultValue: 'Tips for choosing a good project name:',
      required: true,
      admin: {
        description: 'The title for the tips section on Client Dashboard.',
      },
    },
    {
      name: 'tipContent',
      type: 'textarea',
      required: true,
      defaultValue:
        '• Keep it short and straight to the point!\n\n• Please use the description if you would like to say more!',
      admin: {
        description: 'The content for the tips section on Client Dashboard.',
      },
    },
  ],
}
