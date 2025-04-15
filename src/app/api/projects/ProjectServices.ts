import { Project } from "@/payload-types";
import { BasePayload, NotFound, PaginatedDocs } from "payload";

export const getAllProjects = async (payload: BasePayload): Promise<Array<Project>> => {
    const data: PaginatedDocs = await payload.find({
        collection: 'project',
    })
    return data.docs
}

export const getProjectById = async (payload: BasePayload, id: string): Promise<Project | null> => {
    try{
        const data: Project | null = await payload.findByID({
            collection: 'project',
            id,
        })
        return data
    } catch (error){
        if (error instanceof NotFound){
            return null;
        }
    }
    return null;
}

export const getProjectByName = async (payload: BasePayload, name: string): Promise<Project | null> => {
        const data: Project | null = await payload.db.findOne({
            collection: 'project',
            where: {
                name: {
                    equals: name,
                },
            },
        })
        return data;

}

export const getProjectsByClientId = async (payload: BasePayload, clientId: string): Promise<Array<Project>> => {
    const data: PaginatedDocs = await payload.find({
        collection: 'project',
        where: {
            clients: {
                equals: clientId,
            },
        },
    })
    return data.docs;
}

export const createProject = async (payload: BasePayload, data: Project): Promise<Project> => {
    const project: Project = await payload.create({
        collection: 'project',
        data,
    })
    return project;
}