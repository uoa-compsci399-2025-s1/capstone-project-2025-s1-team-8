import { buildNextRequestURL } from "@/utils/buildNextRequestURL"
import { buildNextRequest } from "@/utils/buildNextRequest"
import { GET as GetSemesters } from "@/app/api/semesters/route"
import { SemesterType } from "@/types/Semester"

export const StudentService = {
    getCurrentSemester: async function (): Promise<string | null> {
    const semesterUrl = buildNextRequestURL('/api/semesters', { timeframe: SemesterType.Current })
    const semesterResponse = await GetSemesters(
      await buildNextRequest(semesterUrl, { method: 'GET' }),
    )
    const { data: semester, error } = await semesterResponse.json()

    if (error || !semester?.length) {
      console.error('Failed to fetch next semester:', error)
      return null
    }

    return semester[0].id
  },

}