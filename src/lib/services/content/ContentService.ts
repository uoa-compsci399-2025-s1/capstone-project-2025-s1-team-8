import type { ClientDashboard, Home } from '@/payload-types'
import { GET as getHomePage } from '@/app/api/globals/home/route'
import { GET as getClientDashboard } from '@/app/api/globals/client/route'
import homeContent from '@/lib/defaults/Home'
import clientDashboardContent from '@/lib/defaults/ClientDashboard'

const ContentService = {
  /**
   * Fetches the home page content from the CMS.
   *
   * @returns The home page content
   */
  getHomePage: async function (): Promise<{ content: Home; isFallback: boolean }> {
    'use server'
    const homePage = await getHomePage()

    let homePageCMS: Home = homeContent
    let isFallback = false

    if (homePage.ok) {
      const json = await homePage.json()
      homePageCMS = json.data
    } else {
      console.error('Failed to fetch home page content: ', homePage.status)
      console.warn('Using fallback content for the home page.')
      isFallback = true
    }

    return { content: homePageCMS, isFallback }
  },
  getClientDashboard: async function (): Promise<{
    content: ClientDashboard
    isFallback: boolean
  }> {
    'use server'
    const clientDashoard = await getClientDashboard()

    let clientDashboardCMS: ClientDashboard = clientDashboardContent
    let isFallback = false

    if (clientDashoard.ok) {
      const json = await clientDashoard.json()
      clientDashboardCMS = json.data
    } else {
      console.error('Failed to fetch client dashboard content: ', clientDashoard.status)
      console.warn('Using fallback content for the client dashboard.')
      isFallback = true
    }

    return { content: clientDashboardCMS, isFallback }
  },
}
export default ContentService
