'use server'

import { DndComponentProps } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import AdminProjectService from '../services/admin/AdminProjectService'

export const getNextSemesterProjects = async (): Promise<void | {
  data?: DndComponentProps
}> => {
  const response = await AdminProjectService.getNextSemesterProjects()
  return { data: response.data } // Assuming response.projects is an array of DndComponentProps[]
}
