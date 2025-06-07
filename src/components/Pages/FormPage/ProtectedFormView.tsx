import type { JSX } from 'react'

import FormView from './FormView'
import { redirect } from 'next/navigation'
import ProjectFormService from '@/lib/services/form/projectFormService'
import { StatusCodes } from 'http-status-codes'
import { SemesterType } from '@/types/Semester'
import type { Semester } from '@/payload-types'
import type { CreateProjectRequestBody } from '@/app/api/projects/route'
import type { ProjectDetails } from '@/types/Project'
import { handleFormPageLoad, handleProjectFormSubmission } from '@/lib/services/form/Handlers'

const ProtectedAdminView = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}): Promise<JSX.Element> => {
  const projectId = searchParams?.projectId

  const {
    data: semesters,
    status: semesterStatus,
    error: semesterError,
  } = await ProjectFormService.getUpcomingSemesters({
    timeframe: SemesterType.Upcoming,
    limit: 10,
  })
  
  let { data: project, status, error } = await ProjectFormService.getProjectById(projectId as string)

  // if (projectId && status !== StatusCodes.OK) {
  //   console.error('Error fetching project by ID:', error)
  //   redirect('/client')
  // }
  // console.log('Project ID:', projectId)
  // console.log(project)
  // console.log(semesters)
  return (
    <div>
      <FormView
        projectData={project}
        upcomingSemesters={semesters ?? []}
      />
    </div>
  )
}

export default ProtectedAdminView
