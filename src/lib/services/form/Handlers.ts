'use server'

import ProjectFormService from './projectFormService'
import { StatusCodes } from 'http-status-codes'
import { SemesterType } from '@/types/Semester'
import type { Semester } from '@/payload-types'
import type { CreateProjectRequestBody } from '@/app/api/projects/route'
import type { ProjectDetails } from '@/types/Project'
import { type UpdateProjectRequestBody } from '@/app/api/projects/[id]/route'

/**
 * Handles loading upcoming semesters for the form submission page
 * @returns An object containing upcoming semesters or an error
 */
export const handleFormPageLoad = async (
  projectId?: string,
): Promise<{
  upcomingSemesters: Semester[]
  projectData: ProjectDetails | undefined
  error?: string
}> => {
  const {
    data: semesters,
    status,
    error,
  } = await ProjectFormService.getUpcomingSemesters({
    timeframe: SemesterType.Upcoming,
    limit: 10,
  })

  if (status !== StatusCodes.OK) {
    console.error('Error fetching upcoming semesters:', error)
    return {
      upcomingSemesters: [],
      projectData: undefined,
      error: error || 'Failed to load upcoming semesters',
    }
  }

  if (projectId) {
    const { data: project, status, error } = await ProjectFormService.getProjectById(projectId)

    if (status !== StatusCodes.OK) {
      console.error('Error fetching project by ID:', error)
      return {
        upcomingSemesters: [],
        projectData: undefined,
        error: error || 'Failed to load project data',
      }
    }

    return { upcomingSemesters: semesters || [], projectData: project || undefined }
  }

  return { upcomingSemesters: semesters || [], projectData: undefined }
}

export async function handleProjectFormSubmission(formData: CreateProjectRequestBody): Promise<{
  success: boolean
  error?: string
  message?: string
}> {
  try {
    // Validate required fields
    if (!formData.name) return { success: false, error: 'Project name is required' }
    if (!formData.description) return { success: false, error: 'Project description is required' }
    if (!formData.desiredOutput) return { success: false, error: 'Desired output is required' }
    if (!formData.specialEquipmentRequirements)
      return { success: false, error: 'Special equipment requirements is required' }
    if (!formData.numberOfTeams) return { success: false, error: 'Number of teams is required' }
    if (formData.futureConsideration && formData.semesters.length === 0)
      return { success: false, error: 'At least one semester must be selected' }

    // Submit the form data
    const { status, error, message } = await ProjectFormService.submitProjectForm(formData)

    if (status === StatusCodes.CREATED) {
      return { success: true, message }
    } else {
      return { success: false, error: error || 'Failed to submit project proposal' }
    }
  } catch (error) {
    console.error('Error handling project form submission:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function handleProjectUpdate(
  projectId: string,
  formData: UpdateProjectRequestBody,
): Promise<{
  success: boolean
  error?: string
  message?: string
}> {
  try {
    // Validate required fields
    if (!formData.name) return { success: false, error: 'Project name is required' }
    if (!formData.description) return { success: false, error: 'Project description is required' }
    if (!formData.desiredOutput) return { success: false, error: 'Desired output is required' }
    if (!formData.specialEquipmentRequirements)
      return { success: false, error: 'Special equipment requirements is required' }
    if (!formData.numberOfTeams) return { success: false, error: 'Number of teams is required' }
    if (formData.futureConsideration && formData.semesters?.length === 0)
      return { success: false, error: 'At least one semester must be selected' }

    // Submit the form data
    const { status, error, message, updatedProject } = await ProjectFormService.updateProject(
      projectId,
      formData,
    )

    if (status === StatusCodes.OK && updatedProject) {
      // get all semester projects of this project
      const { data: existingSemesters } = await ProjectFormService.getProjectSemesters(projectId)

      // if the semester is not in the form data, remove it @TODO remove?

      // go through all selected semesters in form data, and create a semester project if it doesn't exist
      for (const upcomingSemester of formData.semesters || []) {
        console.log(upcomingSemester)
        const semesterProjectExists = (existingSemesters || []).some((existingSemester) => {
          return existingSemester.id === upcomingSemester
        })
        if (!semesterProjectExists) {
          const { status } = await ProjectFormService.createSemesterProject(
            upcomingSemester,
            updatedProject,
          )
          if (status !== StatusCodes.CREATED) {
            console.error('Failed to create semester project for', upcomingSemester)
            return { success: false, error: 'Failed to create semester project' }
          }
        }
      }

      return { success: true, message }
    } else {
      return { success: false, error: error || 'Failed to update project proposal' }
    }
  } catch (error) {
    console.error('Error handling project update:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
