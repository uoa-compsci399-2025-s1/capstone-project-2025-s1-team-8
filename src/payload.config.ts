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
import { Authentication } from './data-layer/collections/Authentication'
import { ClientAdditionalInfo } from './data-layer/collections/ClientAdditionalInfo'
import { Admin } from './data-layer/collections/Admin'
import { Home } from './data-layer/globals/Home'
import { s3Storage } from '@payloadcms/storage-s3'
import { Form } from './data-layer/globals/Form'

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
  ],
  globals: [Home, Form],
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
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        region: process.env.S3_REGION,
      },
    }),
  ],
  graphQL: {
    disable: true,
  },
  routes: {
    admin: '/payload/admin',
    api: '/payload/api',
  },
})
