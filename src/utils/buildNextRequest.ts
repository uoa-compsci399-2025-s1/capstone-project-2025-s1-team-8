'use server'
import { RequestWithUser } from '@/types/Requests'
import { NextRequest } from 'next/server'

interface BuildRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  // eslint-disable-next-line
  body?: any
  headers?: HeadersInit
}

/**
 * Builds a NextRequest object with the specified URL, method, body, and headers.
 *
 * @param url The URL for the request.
 * @param options An object containing optional parameters: method, body, and headers.
 * @returns A Promise that resolves to a NextRequest object.
 */

export async function buildNextRequest(
  url: string,
  { method = 'GET', body, headers }: BuildRequestOptions = {},
): Promise<RequestWithUser> {
  return new NextRequest(new URL(url, process.env.NEXT_PUBLIC_URL), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  }) as RequestWithUser
}
