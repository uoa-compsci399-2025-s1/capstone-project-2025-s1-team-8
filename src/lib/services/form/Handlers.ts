'use server'

import ProjectFormService from './projectFormService'
import { StatusCodes } from 'http-status-codes'
import { SemesterType } from '@/types/Semester'
import type { Semester } from '@/payload-types'
import type { CreateProjectRequestBody } from '@/app/api/projects/route'

/**
 * Handles loading upcoming semesters for the form submission page
 * @returns An object containing upcoming semesters or an error
 */
export const handleFormPageLoad = async (): Promise<{
  upcomingSemesters: Semester[]
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
    return { upcomingSemesters: [], error: error || 'Failed to load upcoming semesters' }
  }

  return { upcomingSemesters: semesters || [] }
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
