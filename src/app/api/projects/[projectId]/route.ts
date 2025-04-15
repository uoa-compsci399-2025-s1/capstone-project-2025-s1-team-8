import configPromise from '@payload-config'
import { getProjectById, deleteProject, patchProject, updateProject } from '../ProjectServices'
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

export const DELETE = async ( req: NextRequest, {params} : {params: {projectId: string}}): Promise<Response> => {
    const payload = await getPayload({
        config: configPromise,
    })
    const {projectId} = await params;
    const project: Project| null = await deleteProject(payload, projectId);
    if (!project) {
        return Response.json({error: 'Project not found'}, {status: 404})
    }
    return Response.json({status: 204})
    
}

export const PATCH = async ( req: NextRequest, {params} : {params: {projectId: string}}): Promise<Response> => {
    const payload = await getPayload({
        config: configPromise,
    })
    const {projectId} = await params;
    const data: Partial<Project> = await req.json()
    const project: Project | null = await patchProject(payload, projectId, data)
    if (!project) {
        return Response.json({error: 'Project not found'}, {status: 404})
    }
    return Response.json(project, { status: 201 })    
}

export const PUT = async ( req: NextRequest, {params} : {params: {projectId: string}}): Promise<Response> => {
    const payload = await getPayload({
        config: configPromise,
    })
    const {projectId} = await params;
    const data: Project = await req.json()
    const project: Project | null = await updateProject(payload, projectId, data);
    if (!project) {
        return Response.json({error: 'Project not found'}, {status: 404})
    }
    return Response.json(project, { status: 201 })
}