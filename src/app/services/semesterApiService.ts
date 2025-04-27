export interface Semester {
  id: string;         // Unique identifier for the semester
  name: string;       // Human-readable name of the semester (e.g., "Spring 2025")
  startDate: string;  // ISO string representing the start date (e.g., "2025-01-15")
  endDate: string;    // ISO string representing the end date (e.g., "2025-05-30")
}

export interface PaginatedResponse {
  data: Semester[];  
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
  public static async getAll(options: FetchOptions = {}): Promise<PaginatedResponse> {
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

    const payload = (await response.json()) as PaginatedResponse & { error?: string }; 

    if (!response.ok) {
      const errorMessage = payload.error ?? 'Failed to fetch semesters';
      throw new Error(errorMessage);  
    }

    return {
      data: payload.data,
      nextPage: payload.nextPage,
    };
  }
}
