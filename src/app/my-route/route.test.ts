import { describe, it, expect, afterEach } from 'vitest'

import { GET } from '@/app/my-route/route'

import dotenv from 'dotenv'
import { clearCollection, testPayloadObject } from 'tests/utils'

dotenv.config()

describe('get user count', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'users')
  })

  it('should get 1 user correctly', async () => {
    await testPayloadObject.create({
      collection: 'users',
      data: {
        email: 'jeffery@gmail.com',
        password: '12132',
      },
    })

    const res = await GET()
    expect(await res.json()).toEqual(1)
  })

  it('should get 2 user correctly', async () => {
    await testPayloadObject.create({
      collection: 'users',
      data: {
        email: 'jeffery@gmail.com',
        password: '12132',
      },
    })
    await testPayloadObject.create({
      collection: 'users',
      data: {
        email: 'lolololol@gmail.com',
        password: '12132',
      },
    })

    const res = await GET()
    expect(await res.json()).toEqual(2)
  })
})
