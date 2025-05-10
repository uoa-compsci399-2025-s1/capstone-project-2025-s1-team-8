import { Semester, User } from '@/payload-types'

export enum ProjectStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export interface ProjectDetailsType {
  semesterProjectId: string
  projectId: string
  projectTitle: string
  projectClientDetails: User
  otherClientDetails?: User[]
  projectDescription: string
  desiredOutput: string
  desiredTeamSkills?: string
  availableResources?: string

  specialRequirements: string
  numberOfTeams: string
  futureConsideration: boolean
  semesters?: Semester[]
  submittedDate: Date
}
