// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
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
import { Form } from './data-layer/collections/Form'
import { Authentication } from './data-layer/collections/Authentication'
import { ClientAdditionalInfo } from './data-layer/collections/ClientAdditionalInfo'
import { Admin } from './data-layer/collections/Admin'
import { Home } from './data-layer/globals/Home'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Admin.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname) + '/app/payload/admin/importMap.js',
    },
  },
  collections: [
    Admin,
    Authentication,
    User,
    ClientAdditionalInfo,
    Media,
    Project,
    SemesterProject,
    Semester,
    FormQuestion,
    Form,
  ],
  globals: [Home],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    allowIDOnCreate: process.env.NODE_ENV === 'test',
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
  graphQL: {
    disable: true,
  },
  routes: {
    admin: '/payload/admin',
    api: '/payload/api',
  },
})
