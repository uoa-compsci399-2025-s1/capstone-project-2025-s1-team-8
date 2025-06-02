import { payload } from '@/data-layer/adapters/Payload'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const home = await payload.findGlobal({
    slug: 'form',
  })

  return NextResponse.json({ data: home })
}
