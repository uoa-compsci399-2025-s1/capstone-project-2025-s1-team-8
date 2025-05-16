'use server'

// import { redirect } from 'next/navigation'
import ProjectFormService, { ProjectFormData } from './projectFormService'
import { StatusCodes } from 'http-status-codes'
import { Semester } from '@/payload-types'
import { SemesterType } from '@/types/Semester'
import { z } from 'zod'
import { CreateProjectRequestBodySchema, CreateProjectClientSchema } from '@/app/api/projects/route'
import { CreateProjectData } from '@/types/Collections'

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
  semesterId: string,
  formData: FormData
): Promise<{
  success: boolean,
  error?: string,
  message?: string
}> {
  try {
    // Extract form data
    const otherClients = formData.get('OtherClientDetails') as string
    const projectTitle = formData.get('ProjectTitle') as string
    const projectDescription = formData.get('ProjectDescription') as string
    const desiredOutput = formData.get('DesiredOutput') as string
    const specialEquipmentRequirements = formData.get('SpecialEquipmentRequirements') as string
    const numberOfTeams = formData.get('NumberOfTeams') as string
    const desiredTeamSkills = formData.get('DesiredTeamSkills') as string
    const availableResources = formData.get('AvailableResources') as string
    const futureConsideration = formData.get('FutureConsideration') as string
    
    // Get all selected future semesters
    const futureSemestersEntries = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('FutureSemesters'))
      .map(([_, value]) => value as string)
    
    // Convert checkboxes to booleans
    const meetingAttendance = formData.has('MeetingAttendance')
    const finalPresentationAttendance = formData.has('FinalPresentationAttendance')
    const projectSupportAndMaintenance = formData.has('ProjectSupportAndMaintenance')

    // Validate required fields
    if (!projectTitle) return { success: false, error: 'Project title is required' }
    if (!projectDescription) return { success: false, error: 'Project description is required' }
    if (!desiredOutput) return { success: false, error: 'Desired output is required' }
    if (!specialEquipmentRequirements) return { success: false, error: 'Special equipment requirements is required' }
    if (!numberOfTeams) return { success: false, error: 'Number of teams is required' }
    if (!futureConsideration) return { success: false, error: 'Future consideration is required' }
    if (!meetingAttendance) return { success: false, error: 'Meeting attendance confirmation is required' }
    if (!finalPresentationAttendance) return { success: false, error: 'Final presentation attendance confirmation is required' }
    if (!projectSupportAndMaintenance) return { success: false, error: 'Project support and maintenance confirmation is required' }

    // Create the project form data object
    const projectFormData: ProjectFormData = {
      otherClients,
      projectTitle,
      projectDescription,
      desiredOutput,
      specialEquipmentRequirements,
      numberOfTeams,
      desiredTeamSkills,
      availableResources,
      futureConsideration,
      futureSemesters: futureSemestersEntries,
      meetingAttendance,
      finalPresentationAttendance,
      projectSupportAndMaintenance
    }

    // Submit the form data
    const { status, error, message } = await ProjectFormService.submitProjectForm(
      semesterId,
      projectFormData
    )

    if (status === StatusCodes.CREATED || status === StatusCodes.OK) {
      return { success: true, message: 'Project proposal submitted successfully' }
    } else {
      return { success: false, error: error || 'Failed to submit project proposal' }
    }
  } catch (error) {
    console.error('Error handling project form submission:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}