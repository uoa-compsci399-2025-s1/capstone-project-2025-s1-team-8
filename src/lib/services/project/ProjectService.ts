import { FormResponse, Project, SemesterProject } from '@/payload-types'
import { UpdateSemesterProjectData } from '@/types/Collections'
import { PatchSemesterProjectRequestBody } from '@/app/api/admin/semesters/[id]/projects/[projectId]/route'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { typeToFlattenedError } from 'zod'
import { PATCH as UpdateSemesterProject } from '@/app/api/admin/semesters/[id]/projects/[projectId]/route'
import { GET as GetSemesters } from '@/app/api/semesters/route'
import { GET as GetProjects } from '@/app/api/semesters/[id]/projects/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { ProjectDetailsType, ProjectStatus } from '@/types/Project'
import { QuestionResponse } from '@/types/Form'

//TODO put request body type here

const ProjectService = {
  updateSemesterProject: async function (
    semesterId: string,
    semesterProjectId: string,
    semesterProject: UpdateSemesterProjectData,
  ): Promise<{
    data: SemesterProject
    error?: string
    details?: typeToFlattenedError<typeof PatchSemesterProjectRequestBody>
  }> {
    'use server'
    const url = `/api/admin/semesters/${semesterId}/projects/${semesterProjectId}`
    const response = await UpdateSemesterProject(
      await buildNextRequest(url, { method: 'PATCH', body: semesterProject }),
      {
        params: Promise.resolve({ id: semesterId, projectId: semesterProjectId }),
      },
    )
    const { data, error, details } = await response.json()
    return { data, error, details }
  },


  getNextSemesterProjects: async function (): Promise<{
    data: {
      semesterId: string,
      rejected: ProjectDetailsType[],
      pending: ProjectDetailsType[],
      approved: ProjectDetailsType[]
    },
    error?: string
  }> {
    const semesterUrl = buildNextRequestURL('/api/semesters', { timeframe: 'next' })
    const semesterResponse = await GetSemesters(await buildNextRequest(semesterUrl, { method: 'GET' }))
    const { data: semester, error: semesterError } = await semesterResponse.json()
    
    if (semesterError || !semester) {
      return { data: null as any, error: semesterError || 'No semester found' }
    }
        
    const semesterId = semester[0].id
  
    const fetchProjects = async (status: ProjectStatus) => {
      const url = buildNextRequestURL(`/api/semesters/${semesterId}/projects`, { status })
      const response = await GetProjects(await buildNextRequest(url, { method: 'GET' }), {
        params: Promise.resolve({ id: semesterId }),
      })
      const { data, error }=  await response.json()

      if (error) {
        console.error("Failed to fetch projects:", error);
        return [];
      }
      const projects: ProjectDetailsType[] = data.map((semesterProject: SemesterProject) => {
        const project = semesterProject.project as Project;
        const additionalQuestions = (project.formResponse as FormResponse).questionResponses as QuestionResponse 
        // TODO: don't pass if the question wasn't answered: for non-required questions
        return {
          semesterProjectId: semesterProject.id,
          projectId: project.id,
          projectTitle: project.name,
          projectClientDetails: project.clients[0],
          otherClientDetails: project.clients.length > 1? project.clients[1] : undefined,
          projectDescription: project.description,
          desiredOutput: additionalQuestions[0], //How is this being done????
          desiredTeamSkills: additionalQuestions[1],
          availableResources: project.attachments,
          specialRequirements: additionalQuestions[2],
          numberOfTeams: additionalQuestions[3],
          futureConsideration: additionalQuestions[4],
          // semesters: TODO
          submittedDate: project.createdAt
        };
      });
    
      return projects;
    }
  
    const [
      pendingProjects,
      approvedProjects,
      rejectedProjects,
    ] = await Promise.all([
      fetchProjects(ProjectStatus.Pending),
      fetchProjects(ProjectStatus.Approved),
      fetchProjects(ProjectStatus.Rejected),
    ]);

  
    return {
      data: {
        semesterId: semesterId,
        rejected: rejectedProjects,
        pending: pendingProjects,
        approved: approvedProjects,
      }
    }
  }
}
export default ProjectService
