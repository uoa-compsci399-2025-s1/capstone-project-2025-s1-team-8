import type { Home } from '@/payload-types'
import { GET as GetHomePage } from '@/app/api/globals/home/route'
import homeContent from '@/lib/defaults/Home'

const ContentService = {
  getHomePage: async function (): Promise<Home> {
    'use server'
    const homePage = await GetHomePage()

    let homePageCMS: Home = homeContent
    if (homePage.ok) {
      const json = await homePage.json()
      homePageCMS = json.data
    } else {
      console.error('Failed to fetch home page content')
    }

    return homePageCMS
  },
}
export default ContentService
