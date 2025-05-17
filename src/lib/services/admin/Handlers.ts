'use server'
import { redirect } from 'next/navigation'
import UserService from '../user/UserService'
import { UserRole } from '@/types/User'

export async function handleCSVDownload(semesterId: string) {
  console.log('handleCSVDownload called', semesterId)
  const res = await UserService.getUserSelfData()
  if (!res.user || res.user.role !== UserRole.Admin) {
    return
  }
  redirect(`/api/admin/export/semesters/${semesterId}`)
}
