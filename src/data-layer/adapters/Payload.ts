import { getPayload, Payload } from 'payload'
import configPromise from '@payload-config'

export const payload: Payload = await getPayload({
  config: configPromise,
})
