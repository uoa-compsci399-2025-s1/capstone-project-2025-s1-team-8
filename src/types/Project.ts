import type { Semester, Project } from '@/payload-types'

export enum ProjectStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export type ProjectDetails = Project & {
  semesters: Semester[]
  semesterProjectId?: string
  number?: number
}
