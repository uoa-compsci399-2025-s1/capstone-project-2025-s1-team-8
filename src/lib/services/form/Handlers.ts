'use server'

// import { redirect } from 'next/navigation'
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
  const { data: semesters, status, error } = await ProjectFormService.getUpcomingSemesters({
    timeframe: SemesterType.Upcoming,
    limit: 10
  })

  if (status !== StatusCodes.OK) {
    console.error('Error fetching upcoming semesters:', error)
    return { upcomingSemesters: [], error: error || 'Failed to load upcoming semesters' }
  }

  return { upcomingSemesters: semesters || [] }
}

export async function handleProjectFormSubmission(
  formData: CreateProjectRequestBody,
): Promise<{
  success: boolean,
  error?: string,
  message?: string
}> {
  try {
    // Extract form data
    // const name = formData.get('name') as string
    // const description = formData.get('description') as string
    // const desiredOutput = formData.get('desiredOutput') as string
    // const specialEquipmentRequirements = formData.get('specialEquipmentRequirements') as string
    // const numberOfTeams = formData.get('numberOfTeams') as string
    // const desiredTeamSkills = formData.get('desiredTeamSkills') as string
    // const availableResources = formData.get('availableResources') as string
    // const futureConsideration = formData.get('futureConsideration') === 'Yes'
    // const timestamp = formData.get('timestamp') as string || new Date().toISOString()

    // Parsing semester data
    // const semestersData = formData.get('semesters') as string
    // const semesters = semestersData ? semestersData.split(',').map(s => s.trim()) : []

    // Extract additional clients if provided
    // const additionalClientsData = formData.get('additionalClients') as string
    // let additionalClients = undefined
    // if (additionalClientsData) {
    //   try {
    //     additionalClients = JSON.parse(additionalClientsData) as CreateProjectClient[]
    //   } catch (error) {
    //     console.error('Error parsing additional clients:', error)
    //   }
    // }

    // Validate required fields
    if (!formData.name) return { success: false, error: 'Project name is required' }
    if (!formData.description) return { success: false, error: 'Project description is required' }
    if (!formData.desiredOutput) return { success: false, error: 'Desired output is required' }
    if (!formData.specialEquipmentRequirements) return { success: false, error: 'Special equipment requirements is required' }
    if (!formData.numberOfTeams) return { success: false, error: 'Number of teams is required' }
    if (formData.futureConsideration && formData.semesters.length == 0) return { success: false, error: 'At least one semester must be selected' }

    // Create the project form data object
    // const projectFormData: CreateProjectRequestBody = {
    //   additionalClients,
    //   name,
    //   description,
    //   desiredOutput,
    //   specialEquipmentRequirements,
    //   numberOfTeams,
    //   desiredTeamSkills,
    //   availableResources,
    //   futureConsideration,
    //   timestamp,
    //   semesters
    // }

    // Submit the form data
    const { status, error, message } = await ProjectFormService.submitProjectForm(
      formData
    )

    if (status === StatusCodes.CREATED || status === StatusCodes.OK) {
      return { success: true, message }
    } else {
      return { success: false, error: error || 'Failed to submit project proposal' }
    }
  } catch (error) {
    console.error('Error handling project form submission:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}