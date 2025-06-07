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
      if (!search) {
        return fetchClients(page, search)
      }

      const cachedQueries = queryClient.getQueryCache().findAll({
        queryKey: ['clients'],
      })

      if (cachedQueries.length > 0) {
        const clientMap = new Map<
          string,
          { client: UserCombinedInfo; projects: ProjectDetails[] }
        >()

        cachedQueries.forEach((query) => {
          const data = (query.state.data as ClientsData)?.clients || []
          data.forEach((item) => {
            if (!clientMap.has(item.client.id)) {
              clientMap.set(item.client.id, item)
            }
          })
        })

        const allCachedClients = Array.from(clientMap.values())

        const filteredClients = allCachedClients.filter(({ client }) => {
          const fullName = `${client.firstName} ${client.lastName || ''}`.toLowerCase()
          return (
            fullName.includes(search.toLowerCase()) ||
            client.email.toLowerCase().includes(search.toLowerCase())
          )
        })

        if (filteredClients.length > 0) {
          const startIndex = (page - 1) * ITEMS_PER_PAGE
          const endIndex = startIndex + ITEMS_PER_PAGE
          const paginatedClients = filteredClients.slice(startIndex, endIndex)

          return {
            clients: paginatedClients,
            totalPages: Math.ceil(filteredClients.length / ITEMS_PER_PAGE),
            totalUsers: filteredClients.length,
          }
        }
      }

      return fetchClients(page, search)
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
