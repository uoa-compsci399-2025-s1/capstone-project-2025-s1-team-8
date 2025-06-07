import { useQuery, useQueryClient } from '@tanstack/react-query'
import { handleGetAllSemesters } from '@/lib/services/admin/Handlers'

export const semestersQueryKey = () => ['semesters']

export const fetchSemesters = async () => {
  const response = await handleGetAllSemesters()
  if (!response?.data) {
    throw new Error('Failed to fetch semesters')
  }
  return response
}

export const useSemesters = () => {
  return useQuery({
    queryKey: semestersQueryKey(),
    queryFn: fetchSemesters,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const prefetchSemesters = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await queryClient.prefetchQuery({
    queryKey: semestersQueryKey(),
    queryFn: fetchSemesters,
  })
}
