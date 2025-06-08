import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllClients } from '@/lib/services/admin/Handlers'
import type { UserCombinedInfo } from '@/types/Collections'
import type { ProjectDetails } from '@/types/Project'

const ITEMS_PER_PAGE = 10

type ClientsData = {
  clients: { client: UserCombinedInfo; projects: ProjectDetails[] }[]
  totalPages: number
  totalUsers: number
}

export const clientsQueryKey = (page: number, search: string) => ['clients', { page, search }]

export const fetchClients = async (page: number, search: string): Promise<ClientsData> => {
  const res = await getAllClients({
    limit: ITEMS_PER_PAGE,
    page,
    query: search,
  })
  return {
    clients: res?.data || [],
    totalPages: res?.totalPages || 0,
    totalUsers: res?.totalDocs || 0,
  }
}

export const useClients = (page: number, search: string) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: clientsQueryKey(page, search),
    queryFn: async () => {
      const currentData = await fetchClients(page, search)
      if (currentData.totalPages > page) {
        queryClient.prefetchQuery({
          queryKey: clientsQueryKey(page + 1, search),
          queryFn: () => fetchClients(page + 1, search),
        })
      }

      return currentData
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => {
      if (!previousData) return undefined
      return {
        ...previousData,
        clients: [],
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

export const prefetchClients = async (
  queryClient: ReturnType<typeof useQueryClient>,
  page: number,
  search: string,
) => {
  await queryClient.prefetchQuery({
    queryKey: clientsQueryKey(page, search),
    queryFn: () => fetchClients(page, search),
  })
}
