// setup-teardown-hook.js
import { NextRequest } from 'next/server'
import { CollectionSlug, getPayload, Payload } from 'payload'
import configPromise from '@payload-config'

/**
 * Payload object to use in integration tests
 *
 * @example
 * import { testPayloadObject } from './utils'
 * testPayloadObject.create({
 *   collection: 'posts',
 *   data: {
 *     title: 'Hello, world!',
 *   }
 * }) // create a new document
 */
export const testPayloadObject = await getPayload({
  config: configPromise,
})

/**
 * Clear a collection in the test database
 *
 * @param payloadObject The test integration payload object
 * @param collectionName The name of the collection to clear
 */
export const clearCollection = async (payloadObject: Payload, collectionName: CollectionSlug) => {
  await payloadObject.delete({
    collection: collectionName,
    where: {
      id: {
        exists: true,
      },
    },
  })
}

/**
 * Convert parameters to a promise
 *
 * @param params The parameters to convert to a promise
 * @returns A promise that resolves to the parameters
 */
export const paramsToPromise = <T extends Record<string, unknown>>(params: T): Promise<T> => {
  return Promise.resolve(params)
}

/**
 * Create a mock NextRequest object
 *
 * @param url The URL to use for the mock request
 * @returns A mock NextRequest object
 */
export function createMockNextRequest(url: string) {
  return new NextRequest(new URL(url, 'http://localhost:3000'))
}

/**
* Create a mock NextRequest object with a body
*
* @param url The URL to use for the mock request
* @param body The body to use for the mock request
* @returns A mock NextRequest object with a body
*/
export function createMockNextPostRequest(url: string, body: Record<string, unknown>) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
}
