'use server'

import { DndComponentProps } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import AdminService from '../services/admin'

export const getNextSemesterProjects = async (): Promise<void | {
  data?: DndComponentProps
}> => {
  const response = await AdminService.getNextSemesterProjects()
  return { data: response.data } // Assuming response.projects is an array of DndComponentProps[]
}
