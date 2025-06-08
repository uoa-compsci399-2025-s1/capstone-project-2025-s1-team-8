import { useQuery } from '@tanstack/react-query'
import { handleClientPageLoad } from '../services/client/Handlers'

export const clientPageQueryKey = () => ['clientPage']

export const fetchProjects = async () => {
  const response = await handleClientPageLoad()
  if (!response?.projects) {
    throw new Error('Failed to fetch projects')
  }
  return response.projects
}

export const useClientPage = () => {
  return useQuery({
    queryKey: clientPageQueryKey(),
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
