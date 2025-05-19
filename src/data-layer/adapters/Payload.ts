import type { Payload } from 'payload';
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { testPayloadObject } from '@/test-config/utils'

let payloadConfig = await getPayload({
  config: configPromise,
})

if (process.env.NODE_ENV === 'test') {
  payloadConfig = testPayloadObject
}

export const payload: Payload = payloadConfig
