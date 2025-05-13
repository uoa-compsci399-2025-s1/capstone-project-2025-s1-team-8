import { Semester } from '@/payload-types'
export const mockSemesters: Semester[] = [
  {
    id: 's1',
    name: 'Semester 1',
    startDate: '2023-09-01',
    endDate: '2024-01-31',
    createdAt: '2023-10-01T12:00:00Z',
    updatedAt: '2023-10-01T12:00:00Z',
    deadline: '2024-01-15',
  },
  {
    id: 's2',
    name: 'Semester 2',
    startDate: '2024-02-01',
    endDate: '2024-06-30',
    createdAt: '2023-10-01T12:00:00Z',
    updatedAt: '2023-10-01T12:00:00Z',
    deadline: '2024-03-15',
  },
  {
    id: 's3',
    name: 'Semester 3',
    startDate: '2024-07-01',
    endDate: '2024-11-30',
    createdAt: '2023-10-01T12:00:00Z',
    updatedAt: '2023-10-01T12:00:00Z',
    deadline: '2024-08-15',
  },
]

export const mockSemestersNested: Semester[][] = [
  mockSemesters,
  [mockSemesters[0]],
  [mockSemesters[1], mockSemesters[2]],
]

export const semesterNames1: string[] = [
  'Semester 1 2024',
  'Semester 2 2024',
  'Semester 1 2025',
  'Semester 2 2025',
  'Semester 1 2026',
  'Semester 2 2026',
]
