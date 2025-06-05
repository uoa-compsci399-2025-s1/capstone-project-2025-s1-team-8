import type { Home } from '@/payload-types'
import { GET as GetHomePage } from '@/app/api/globals/home/route'
import homeContent from '@/lib/defaults/Home'

const ContentService = {
  /**
   * Fetches the home page content from the CMS.
   *
   * @returns The home page content
   */
  getHomePage: async function (): Promise<{ content: Home; isFallback: boolean }> {
    'use server'
    const homePage = await GetHomePage()

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
}
export default ContentService
