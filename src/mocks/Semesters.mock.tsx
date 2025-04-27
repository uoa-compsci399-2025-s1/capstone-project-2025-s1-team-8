import { SemesterDTOPlaceholder } from '@/components/Composite/SemesterCard/SemesterCard'
import { mockProjects } from './Projects.mock'

export const mockSemesters: SemesterDTOPlaceholder[] = [
  {
    semesterName: 'Semester 2 2026',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-12-15'),
    submissionDeadline: new Date('2025-01-30'),
    approvedProjects: mockProjects,
  },
  {
    semesterName: 'Semester 1 2026',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-12-15'),
    submissionDeadline: new Date('2025-01-30'),
    approvedProjects: mockProjects,
  },
  {
    semesterName: 'Semester 2 2025',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-12-15'),
    submissionDeadline: new Date('2025-01-30'),
    approvedProjects: mockProjects,
    currentOrUpcoming: 'upcoming',
  },
  {
    semesterName: 'Semester 1 2025',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-12-15'),
    submissionDeadline: new Date('2025-01-30'),
    approvedProjects: mockProjects,
    currentOrUpcoming: 'current',
  },
  {
    semesterName: 'Semester 2 2024',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-12-15'),
    submissionDeadline: new Date('2025-01-30'),
    approvedProjects: mockProjects,
  },
  {
    semesterName: 'Semester 1 2024',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-12-15'),
    submissionDeadline: new Date('2025-01-30'),
    approvedProjects: mockProjects,
  },
  {
    semesterName: 'Semester 2 2023',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-12-15'),
    submissionDeadline: new Date('2025-01-30'),
    approvedProjects: mockProjects,
  },
  {
    semesterName: 'Semester 1 2023',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-12-15'),
    submissionDeadline: new Date('2025-01-30'),
    approvedProjects: mockProjects,
  },
]
