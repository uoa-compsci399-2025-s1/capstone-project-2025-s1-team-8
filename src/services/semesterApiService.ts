"use server"

import { Semester, SemesterProject } from '@/payload-types'
import { GET } from '@/app/api/semesters/route'
import { buildNextRequestURL } from '../utils/buildNextRequestURL'
import { buildNextRequest } from '../utils/buildNextRequest'
import { CreateSemesterData } from '@/types/Collections'

export async function getAllSemesters(options: {page?: number, limit?: number} = {}): Promise<Semester[]> {
  const url = buildNextRequestURL('/api/semesters', options)
  const response = await GET(await buildNextRequest(url, { method: 'GET' }))
  const data = await response.json()
  return data
}

export async function getAllApprovedProjectsBySemesterId(semesterId: string): Promise<SemesterProject[]> {
  const url = `/api/semesters/${semesterId}/projects`
  const response = await GET(await buildNextRequest(url, { method: 'GET' }))
  const data = await response.json()
  return data
}

export async function createSemester(semester: CreateSemesterData): Promise<Semester> { 
  const url = '/api/admin/semesters'
  const response = await GET(await buildNextRequest(url, { method: 'POST', body: JSON.stringify(semester) }))
  const data = await response.json()
  return data
}

export async function updateSemester(semesterId: string, semester: CreateSemesterData): Promise<Semester> {
  const url = `/api/admin/semesters/${semesterId}`
  const response = await GET(await buildNextRequest(url, { method: 'PATCH', body: JSON.stringify(semester) }))
  const data = await response.json()
  return data
}