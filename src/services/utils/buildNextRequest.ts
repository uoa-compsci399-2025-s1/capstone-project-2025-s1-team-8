"use server"
import { NextRequest } from "next/server"

interface BuildRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: any
  headers?: HeadersInit
}

export async function buildNextRequest(
  url: string,
  { method = 'GET', body, headers }: BuildRequestOptions = {}
): Promise<NextRequest> {
  return new NextRequest(new URL(url, process.env.NEXT_PUBLIC_URL), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}
