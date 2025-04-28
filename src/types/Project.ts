export enum ProjectStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export interface BasicClientDetails {
  name: string
  email: string
}

export interface PlaceholderProjectDetailsType {
  projectId: string
  projectTitle: string
  projectClientDetails: BasicClientDetails
  otherClientDetails?: BasicClientDetails[]
  projectDescription: string
  desiredOutput: string
  desiredTeamSkills: string
  availableResources: string

  specialRequirements: boolean
  numberOfTeams: number
  futureConsideration: boolean
  Semesters: Array<string>
  submittedDate: Date
}
