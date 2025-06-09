import { useQuery } from '@tanstack/react-query'
import { handleStudentPageLoad } from '../services/student/Handlers'

export const studentPageQueryKey = () => ['studentPage']

export const fetchProjects = async () => {
  const response = await handleStudentPageLoad()
  if (!response?.projects) {
    throw new Error('Failed to fetch projects')
  }
  return response
}

export const useStudentPage = () => {
  return useQuery({
    queryKey: studentPageQueryKey(),
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
