import configPromise from '@payload-config'
import { getProjectById } from '../ProjectServices'
import { NextRequest } from 'next/server'
import { getPayload, NotFound } from 'payload'
import { Project } from '@/payload-types'

export const GET = async ( req: NextRequest, {params} : {params: {projectId: string}}): Promise<Response> => {
  const payload = await getPayload({
    config: configPromise,
  })
  const {projectId} = await params;
    const data: Project | null = await getProjectById(payload, projectId)
    if (!data) {
        return Response.json({error: 'Project not found'}, {status: 404})
    }
    return Response.json(data)

}
