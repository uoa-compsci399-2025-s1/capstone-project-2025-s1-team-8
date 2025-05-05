import { CollectionConfig } from 'payload'

export const Authentication: CollectionConfig = {
  slug: 'authentication',
  access: {},
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'The email who owns this authentication',
      },
    },
    {
      name: 'password',
      type: 'text',
      required: false,
      admin: {
        description: 'The hashed user password',
      },
    },
    {
      name: 'provider',
      type: 'select',
      options: [{ label: 'Google', value: 'google' }],
      required: false,
      admin: {
        description: 'The type of authentication',
      },
    },
    {
      name: 'providerAccountId',
      type: 'text',
      required: false,
      admin: {
        description: 'The provider account id of the user authentication',
      },
    },
    {
      name: 'refreshToken',
      type: 'text',
      required: false,
      admin: {
        description: 'The refresh token of the user authentication',
      },
    },
    {
      name: 'accessToken',
      type: 'text',
      required: false,
      admin: {
        description:
          'The access token of the user authentication, only applicable for google oauth',
      },
    },
    {
      name: 'expiresAt',
      type: 'number',
      required: false,
      admin: {
        description: 'The expiration time of the access token',
      },
    },
    {
      name: 'tokenType',
      type: 'text',
      required: false,
      admin: {
        description: 'The type of token',
      },
    },
    {
      name: 'scope',
      type: 'text',
      required: false,
      admin: {
        description: 'The scope of the token',
      },
    },
    {
      name: 'idToken',
      type: 'text',
      required: false,
      admin: {
        description: 'The id token of the user authentication',
      },
    },
  ],
}
