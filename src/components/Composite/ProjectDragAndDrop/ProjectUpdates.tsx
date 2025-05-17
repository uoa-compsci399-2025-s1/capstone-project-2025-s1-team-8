'use server'
import AdminProjectService from '@/lib/services/admin/AdminProjectService'
import { ProjectStatus } from '@/types/Project'
import { DNDType } from './ProjectDnD'

export interface UpdateParams {
  containers: DNDType[]
  semesterId: string
}

export async function updateProjectOrdersAndStatus({
  containers,
  semesterId,
}: UpdateParams): Promise<void> {
  for (const container of containers) {
    const status = container.title as ProjectStatus

    for (let i = 0; i < container.currentItems.length; i++) {
      const project = container.currentItems[i]
      const updatedOrderAndStatus = {
        number: container.currentItems.length - i,
        status,
      }

      await AdminProjectService.updateSemesterProject(
        semesterId,
        project.projectInfo.semesterProjectId ?? '',
        updatedOrderAndStatus,
      )
    }
  }
}

export async function handlePublishChanges({
  containers,
  semesterId,
}: UpdateParams): Promise<void> {
  const container = containers[2]
  for (let i = 0; i < container.currentItems.length; i++) {
    const project = container.currentItems[i]
    await AdminProjectService.updateSemesterProject(
      semesterId,
      project.projectInfo.semesterProjectId ?? '',
      { published: true },
    )
  }
}
