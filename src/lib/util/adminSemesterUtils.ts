'use server'

import { CreateSemesterRequestBody } from '@/app/api/admin/semesters/route'
import { typeToFlattenedError } from 'zod'
import AdminSemesterService from '@/lib/services/admin/AdminSemesterService'

export const handleCreateSemester = async (
  formData: FormData,
): Promise<void | {
  error?: string
  message?: string
  details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
}> => {
  const name = formData.get('semesterName') as string
  const deadline = new Date(formData.get('submissionDeadline') as string)
  const startDate = new Date(formData.get('startDate') as string)
  const endDate = new Date(formData.get('endDate') as string)

  if (!name) return { error: 'Semester name is required' }
  if (!deadline) return { error: 'Submission deadline is required' }
  if (!startDate) return { error: 'Start date is required' }
  if (!endDate) return { error: 'End date is required' }

  const { status, error, details } = await AdminSemesterService.createSemester({
    name,
    startDate,
    endDate,
    deadline,
  })

  if (status === 201) {
    return { message: 'Semester created successfully' }
  } else {
    return { error, details }
  }
}
