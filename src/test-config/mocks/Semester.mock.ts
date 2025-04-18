import { CreateSemesterData } from '@/types/Collections'
import { semesterProjectMock } from './Project.mock'

/*
 * Semester mocks
 */

export const semesterCreateMock: CreateSemesterData = {
  name: 'Semester 2 2025',
  projects: [semesterProjectMock],
  deadline: new Date().toISOString(),
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
}
