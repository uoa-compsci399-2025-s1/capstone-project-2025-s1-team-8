// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { User } from './collections/User'
import { Media } from './collections/Media'
<<<<<<< HEAD
import { Semester } from './collections/Semester'
=======
import { FormQuestion } from './collections/FormQuestion'
import { Form } from './collections/Form'
import { FormResponse } from './collections/FormResponse'
>>>>>>> main

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: User.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname) + '/app/payload/admin/importMap.js',
    },
  },
<<<<<<< HEAD

  collections: [Users, Media, Semester],
=======
  collections: [User, Media, FormQuestion, FormResponse, Form],
>>>>>>> main
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  routes: {
    admin: '/payload/admin',
    api: '/payload/api',
    graphQL: '/payload/graphql',
    graphQLPlayground: '/payload/graphql-playground',
  },
})
