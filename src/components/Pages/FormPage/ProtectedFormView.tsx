import type { JSX } from 'react'

import InvalidFormView from './InvalidFormView'
import FormView from './FormView'
import ProjectFormService from '@/lib/services/form/projectFormService'
import { SemesterType } from '@/types/Semester'

const ProtectedFormView = async ({ projectId }: { projectId?: string }): Promise<JSX.Element> => {
  const { data: semesters } = await ProjectFormService.getUpcomingSemesters({
    timeframe: SemesterType.Upcoming,
    limit: 10,
  })

  const { data: project } = await ProjectFormService.getProjectById(projectId as string)

  return projectId && !project ? (
    <InvalidFormView />
  ) : (
    <FormView projectData={project} upcomingSemesters={semesters ?? []} />
  )
}

export default ProtectedFormView
