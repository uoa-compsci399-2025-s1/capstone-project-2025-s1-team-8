import { describe, it, expect, afterEach } from 'vitest'

import { GET } from '@/app/api/my-route/route'

import dotenv from 'dotenv'
import { clearCollection, testPayloadObject } from 'tests/utils'

dotenv.config()

describe('get user count', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })

  it('should get 1 user correctly', async () => {
    await testPayloadObject.create({
      collection: 'user',
      data: {
        email: 'jeffery@gmail.com',
        password: '1234',
        firstName: '12132',
        lastName: 'lastName',
        role: 'admin',
      },
    })

    const res = await GET()
    expect(await res.json()).toEqual(1)
  })

  it('should get 2 user correctly', async () => {
    await testPayloadObject.create({
      collection: 'user',
      data: {
        email: 'jeffery@gmail.com',
        password: '1234',
        firstName: '12132',
        lastName: 'lastName',
        role: 'admin',
      },
    })
    await testPayloadObject.create({
      collection: 'user',
      data: {
        email: 'jeffery1@gmail.com',
        password: '1234',
        firstName: '12132',
        lastName: 'lastName',
        role: 'admin',
      },
    })

    const res = await GET()
    expect(await res.json()).toEqual(2)
  })
})
