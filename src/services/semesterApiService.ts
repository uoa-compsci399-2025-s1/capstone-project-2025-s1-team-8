"use server"

import { Semester, SemesterProject } from '@/payload-types'
import { GET as GetSemesters } from '@/app/api/semesters/route'
import { GET as GetProjects } from '@/app/api/semesters/[id]/projects/route'
import { POST } from '@/app/api/admin/semesters/route'
import { PATCH } from '@/app/api/admin/semesters/[id]/route'
import { buildNextRequestURL } from '../utils/buildNextRequestURL'
import { buildNextRequest } from '../utils/buildNextRequest'
import { CreateSemesterData } from '@/types/Collections'
import { UpdateSemesterData } from '@/types/Collections'

export async function getAllSemesters(options: {page?: number, limit?: number} = {}): Promise<Semester[]> {
  const url = buildNextRequestURL('/api/semesters', options)
  const response = await GetSemesters(await buildNextRequest(url, { method: 'GET' }))
  const data = await response.json()
  return data
}

export async function getAllApprovedProjectsBySemesterId(semesterId: string): Promise<SemesterProject[]> {
  const url = `/api/semesters/${semesterId}/projects`
  const response = await GetProjects(await buildNextRequest(url, { method: 'GET' }), {params: Promise.resolve({ id: semesterId })} )
  const data = await response.json()
  return data
}

export async function createSemester(semester: CreateSemesterData): Promise<Semester> { 
  const url = '/api/admin/semesters'
  const response = await POST(await buildNextRequest(url, { method: 'POST', body: semester }))
  const data = await response.json()
  return data
}

export async function updateSemester(semesterId: string, semester: UpdateSemesterData): Promise<Semester> {
  const url = `/api/admin/semesters/${semesterId}`
  const response = await PATCH(await buildNextRequest(url, { method: 'PATCH', body: semester}), {params: Promise.resolve({ id: semesterId })} )
  const data = await response.json()
  return data
}