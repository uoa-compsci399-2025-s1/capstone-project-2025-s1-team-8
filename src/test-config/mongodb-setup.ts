import { MongoMemoryServer } from 'mongodb-memory-server'

export const mongod = await MongoMemoryServer.create()

process.env.DATABASE_URI = mongod.getUri()
process.env.PAYLOAD_SECRET = 'we_are_the_best!!!'
