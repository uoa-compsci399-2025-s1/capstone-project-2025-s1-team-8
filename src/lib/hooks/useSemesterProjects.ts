import { useQuery } from '@tanstack/react-query'
import { handleGetAllSemesterProjects } from '../services/admin/Handlers'
import { ProjectDetails } from '@/types/Project'

export const semesterProjectsQueryKey = (semesterId: string) => ['semesterProjects', semesterId]

export const fetchSemesterProjects = async (
  semesterId: string,
): Promise<{ data: ProjectDetails[] }> => {
  const response = await handleGetAllSemesterProjects(semesterId)
  if (!response?.data) {
    throw new Error('Failed to fetch projects')
  }
  return { data: response.data }
}

export const useSemesterProjects = (semesterId: string) => {
  return useQuery({
    queryKey: semesterProjectsQueryKey(semesterId),
    queryFn: async () => {
      const { data } = await fetchSemesterProjects(semesterId)
      return data
    },
    placeholderData: (previousData) => {
      if (!previousData) return undefined
      return previousData
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
