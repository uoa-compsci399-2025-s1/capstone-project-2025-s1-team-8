import { Semester, SemesterProject } from '@/payload-types'
import { CreateSemesterData, UpdateSemesterData } from '@/types/Collections'
import { GET } from '@/app/api/semesters/route'
import { buildNextRequest } from './utils/buildNextRequest'

export default class semesterApiService {
  public static async getAllSemesters(options: {page?: number, limit?: number} = {}) {
    const { page, limit } = options

    let url = '/api/semesters'

    const params = new URLSearchParams()
    if (page !== undefined) params.append('page', page.toString())
    if (limit !== undefined) params.append('limit', limit.toString())

    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    const request = buildNextRequest(url)
    const response = await GET(await request)
    return response.json()
  }
}

export interface SemestersPaginatedResponse {
  data: Semester[]
  nextPage: number | null
}

export interface ProjectsPaginatedResponse {
  data: SemesterProject[]
  nextPage: number | null
}

export interface FetchOptions {
  page?: number
  limit?: number
}

// default class SemesterApi {
//   /**
//    * Fetches all semesters from the API with optional pagination.
//    * @param options Optional parameters: page number and limit per page.
//    * @returns A promise resolving to a PaginatedResponse object.
//    * @throws An Error if the network response is not OK.
//    */
//   public static async getAllSemesters(
//     options: FetchOptions = {},
//   ): Promise<SemestersPaginatedResponse> {
//     const { page, limit } = options

//     let url = '/api/semesters'

//     const params = new URLSearchParams()
//     if (page !== undefined) params.append('page', page.toString())
//     if (limit !== undefined) params.append('limit', limit.toString())

//     const queryString = params.toString()
//     if (queryString) {
//       url += `?${queryString}`
//     }

//     const response = await fetch(url, {
//       method: 'GET',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })

//     const payload = (await response.json()) as SemestersPaginatedResponse & { error?: string }

//     if (!response.ok) {
//       const errorMessage = payload.error ?? 'Failed to fetch semesters'
//       throw new Error(errorMessage)
//     }

//     return {
//       data: payload.data,
//       nextPage: payload.nextPage,
//     }
//   }

//   /**
//    * Fetches all approved projects depending on the semester ID.
//    * @param semesterId The ID of the semester to fetch projects for.
//    * @returns A promise resolving to a PaginatedResponse object.
//    * @throws An Error if the network response is not OK.
//    */
//   public static async getAllApprovedProjectsBySemesterId(
//     semesterId: string,
//   ): Promise<ProjectsPaginatedResponse> {
//     const response = await fetch(`/api/semesters/${semesterId}/projects`, {
//       method: 'GET',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })

//     const payload = (await response.json()) as ProjectsPaginatedResponse & { error?: string }

//     if (!response.ok) {
//       const errorMessage = payload.error ?? 'Failed to fetch approved projects'
//       throw new Error(errorMessage)
//     }

//     return {
//       data: payload.data,
//       nextPage: payload.nextPage,
//     }
//   }

//   /**
//    * Creates a new semester.
//    * @param semester The semester object to create.
//    * @returns A promise resolving to the created semester object.
//    * @throws An Error if the network response is not OK.
//    */
//   public static async createSemester(semester: CreateSemesterData): Promise<Semester> {
//     const response = await fetch('/api/admin/semesters', {
//       method: 'POST',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(semester),
//     })

//     const payload = (await response.json()) as Semester & { error?: string }

//     if (!response.ok) {
//       const errorMessage = payload.error ?? 'Failed to create semester'
//       throw new Error(errorMessage)
//     }

//     return payload
//   }

//   /**
//    * Updates an existing semester.
//    * @param semesterId The ID of the semester to update.
//    * @param semester The updated semester object.
//    * @returns A promise resolving to the updated semester object.
//    * @throws An Error if the network response is not OK.
//    */
//   public static async updateSemester(
//     semesterId: string,
//     semester: UpdateSemesterData,
//   ): Promise<Semester> {
//     const response = await fetch(`/api/admin/semesters/${semesterId}`, {
//       method: 'PATCH',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(semester),
//     })

//     const payload = (await response.json()) as Semester & { error?: string }

//     if (!response.ok) {
//       const errorMessage = payload.error ?? 'Failed to update semester'
//       throw new Error(errorMessage)
//     }

//     return payload
//   }
// }
