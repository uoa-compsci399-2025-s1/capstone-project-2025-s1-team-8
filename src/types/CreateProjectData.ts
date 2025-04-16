import { Media, User } from '@/payload-types'
export interface CreateProjectData {
  name: string
  clients: (string | User)[]
  description: string
  attachments?: (string | Media)[] | null
  deadline?: string | null
  timestamp: string
}
