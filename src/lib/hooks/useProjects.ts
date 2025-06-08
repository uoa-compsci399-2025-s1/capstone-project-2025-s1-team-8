import { useQuery } from '@tanstack/react-query'
import type { useQueryClient } from '@tanstack/react-query'
import { getNextSemesterProjects } from '@/lib/services/admin/Handlers'

export const projectsQueryKey = () => ['projects']

export const fetchProjects = async () => {
  const response = await getNextSemesterProjects()
  if (!response?.data) {
    throw new Error('Failed to fetch projects')
  }
  return response.data
}

export const useProjects = () => {
  return useQuery({
    queryKey: projectsQueryKey(),
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const prefetchProjects = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await queryClient.prefetchQuery({
    queryKey: projectsQueryKey(),
    queryFn: fetchProjects,
  })
}
