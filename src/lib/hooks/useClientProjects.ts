import { useQuery } from '@tanstack/react-query'
import { handleGetAllProjectsByClient } from '../services/admin/Handlers'
import type { ProjectDetails } from '@/types/Project'

export const clientProjectsQueryKey = (clientId: string) => ['clientProjects', clientId]

export const fetchClientProjects = async (
  semesterId: string,
): Promise<{ data: ProjectDetails[] }> => {
  const response = await handleGetAllProjectsByClient(semesterId)
  if (!response?.data) {
    throw new Error('Failed to fetch projects')
  }
  return { data: response.data }
}

export const useClientProjects = (semesterId: string) => {
  return useQuery({
    queryKey: clientProjectsQueryKey(semesterId),
    queryFn: async () => {
      const { data } = await fetchClientProjects(semesterId)
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
