import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const payload = await getPayload({
  config: configPromise,
})
