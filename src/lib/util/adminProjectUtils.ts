'use server'

import { DndComponentProps } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import AdminService from '../services/admin'
import { ProjectStatus } from '@/types/Project'
import { DNDType } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'

export const getNextSemesterProjects = async (): Promise<void | {
  data?: {semesterId: string, presetContainers: DNDType[]}
}> => {
  const response = await AdminService.getNextSemesterProjects()
  return { data: response.data }
}

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
    const shouldSetUnpublished = status === ProjectStatus.Rejected || status === ProjectStatus.Pending

    for (let i = 0; i < container.currentItems.length; i++) {
      const project = container.currentItems[i]
      const updatedOrderAndStatus = {
        number: container.currentItems.length - i,
        status,
        ...(shouldSetUnpublished && { published: false }),
      }

      await AdminService.updateSemesterProject(
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
    await AdminService.updateSemesterProject(
      semesterId,
      project.projectInfo.semesterProjectId ?? '',
      { published: true },
    )
  }
  await updateProjectOrdersAndStatus({containers, semesterId})
}