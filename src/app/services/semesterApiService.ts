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
  public static async getAllApprovedProjects(semesterId: string): Promise<ProjectsPaginatedResponse> {
    const response = await fetch(`/api/semesters/${semesterId}/projects`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const payload = (await response.json()) as ProjectsPaginatedResponse & { error?: string }; 

    if (!response.ok) {
      const errorMessage = payload.error ?? 'Failed to fetch approved projects';
      throw new Error(errorMessage);  
    }

    return {
      data: payload.data,
      nextPage: payload.nextPage,
    };
  }

  /**
   * Creates a new semester project.
   * @param semesterProject The semester project data to create.
   * @returns A promise resolving to the created semester project.
   * @throws An Error if the network response is not OK.
   */
  public static async createSemesterProject(semesterProject: SemesterProjectSelect): Promise<SemesterProjectSelect> {
    const response = await fetch('/api/semesters/projects', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(semesterProject),
    });

    const payload = (await response.json()) as SemesterProjectSelect & { error?: string }; 

    if (!response.ok) {
      const errorMessage = payload.error ?? 'Failed to create semester project';
      throw new Error(errorMessage);  
    }

    return payload;
  }

  /**
   * Updates an existing semester project.
   * @param semesterProjectId The ID of the semester project to update.
   * @param updatedData The updated data for the semester project.
   * @returns A promise resolving to the updated semester project.
   * @throws An Error if the network response is not OK.
   */
  public static async updateSemesterProject(semesterProjectId: string, updatedData: Partial<SemesterProjectSelect>): Promise<SemesterProjectSelect> {
    const response = await fetch(`/api/semesters/projects/${semesterProjectId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const payload = (await response.json()) as SemesterProjectSelect & { error?: string }; 

    if (!response.ok) {
      const errorMessage = payload.error ?? 'Failed to update semester project';
      throw new Error(errorMessage);  
    }

    return payload;
  }
}
