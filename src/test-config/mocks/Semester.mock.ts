import type { Semester } from '@/payload-types'
import type { CreateSemesterData } from '@/types/Collections'

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

export const semesterMock: Semester = {
  id: '67ff38a56a35e1b6cf43a68d',
  name: 'Semester 2 2025',
  description: 'Description of the semester',
  deadline: new Date().toISOString(),
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const semesterCreateMock2: CreateSemesterData = {
  name: 'Semester 3 2025',
  description: 'Description of the semester',
  deadline: new Date().toISOString(),
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
}

export const mockSemesters: Semester[] = [
  semesterMock,
  { ...semesterMock, name: 'Semester 1 2026' },
  { ...semesterMock, name: 'Semester 2 2026' },
]

export const semesterNames: string[] = mockSemesters.map((semester: Semester) => semester.name)

export const mockSemestersNested: Semester[][] = [
  mockSemesters,
  [mockSemesters[0]],
  [mockSemesters[1], mockSemesters[2]],
]
