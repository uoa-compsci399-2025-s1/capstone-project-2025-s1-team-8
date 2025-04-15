import { Project } from '@/payload-types'
import configPromise from '@payload-config'
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import { createProject, getAllProjects } from './ProjectServices'

export const GET = async (req: NextRequest) :Promise<Response>=> {
  const payload = await getPayload({
    config: configPromise,
  })

  const params: URLSearchParams = req.nextUrl.searchParams
  console.log(!params)
  const data: Array<Project> = await getAllProjects(payload);

  return Response.json(data)
}

export const POST = async (req: NextRequest): Promise<Response> => {
    const payload = await getPayload({
        config: configPromise,
    })
    
    const data: Project = await req.json()

    //console.log('data', data)
    try{
        const project: Project = await createProject(payload, data);
        return Response.json(project, { status: 201 })
    } catch (error){
        return Response.json({ "error": error.data.errors }, { status: 500 })
    }

    
}