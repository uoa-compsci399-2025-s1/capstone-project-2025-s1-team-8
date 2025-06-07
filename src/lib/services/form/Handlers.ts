'use server'

import ProjectFormService from './projectFormService'
import { StatusCodes } from 'http-status-codes'
import type { CreateProjectRequestBody } from '@/app/api/projects/route'

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
