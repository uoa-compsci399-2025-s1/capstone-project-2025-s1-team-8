import { SemesterProjectSelect } from "@/payload-types";
import { SemesterSelect } from "@/payload-types";

export interface SemestersPaginatedResponse {
  data: SemesterSelect[];  
  nextPage: number | null; 
}

export interface ProjectsPaginatedResponse {
  data: SemesterProjectSelect[];  
  nextPage: number | null; 
}

export interface FetchOptions {
  page?: number; 
  limit?: number;
}

export default class SemesterApiService {
  /**
   * Fetches all semesters from the API with optional pagination.
   * @param options Optional parameters: page number and limit per page.
   * @returns A promise resolving to a PaginatedResponse object.
   * @throws An Error if the network response is not OK.
   */
  public static async getAll(options: FetchOptions = {}): Promise<SemestersPaginatedResponse> {
    const { page, limit } = options;

    let url = '/api/semesters';

    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (limit !== undefined) params.append('limit', limit.toString());

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const payload = (await response.json()) as SemestersPaginatedResponse & { error?: string }; 

    if (!response.ok) {
      const errorMessage = payload.error ?? 'Failed to fetch semesters';
      throw new Error(errorMessage);  
    }

    return {
      data: payload.data,
      nextPage: payload.nextPage,
    };
  }

  /**
   * Fetches all approved projects depending on the semester ID.
   * @param semesterId The ID of the semester to fetch projects for.
   * @returns A promise resolving to a PaginatedResponse object.
   * @throws An Error if the network response is not OK.
   */
  public static async getAllApprovedProjects(semesterId: string): Promise<SemestersPaginatedResponse> {
    const response = await fetch(`/api/semesters/${semesterId}/projects`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const payload = (await response.json()) as SemestersPaginatedResponse & { error?: string }; 

    if (!response.ok) {
      const errorMessage = payload.error ?? 'Failed to fetch approved projects';
      throw new Error(errorMessage);  
    }

    return {
      data: payload.data,
      nextPage: payload.nextPage,
    };
  }
}
