import { CreateSemesterData } from '@/types/Collections'

/*
 * Semester mocks
 */

export const semesterCreateMock: CreateSemesterData = {
  name: 'Semester 2 2025',
  description: 'Description of the semester',
  deadline: new Date().toISOString(),
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
}
