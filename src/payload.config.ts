// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { User } from './data-layer/collections/User'
import { Media } from './data-layer/collections/Media'
import { Project } from './data-layer/collections/Project'
import { SemesterProject } from './data-layer/collections/SemesterProject'
import { Semester } from './data-layer/collections/Semester'
import { FormQuestion } from './data-layer/collections/FormQuestion'
import { FormResponse } from './data-layer/collections/FormResponse'
import { Form } from './data-layer/collections/Form'

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
  collections: [User, Media, Project, SemesterProject, Semester, FormQuestion, FormResponse, Form],
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
