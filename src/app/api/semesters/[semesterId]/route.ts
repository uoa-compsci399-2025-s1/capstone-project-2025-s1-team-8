import { Semester } from '@/payload-types'
import { SemesterService } from '@/data-layer/services/SemesterService'
import { NextResponse } from 'next/server'

export interface ResponseData {
  data: Semester
}

export const GET = async ({ params }: { params: { semesterId: string } }) => {
  const { semesterId } = params
  console.log(semesterId)
  const semesterService = new SemesterService()
  try {
    const semester = await semesterService.getSemester(semesterId || '')
    return NextResponse.json({ data: semester })
  } catch {
    return NextResponse.json({ error: 'Semester not found' }, { status: 404 })
  }
}
