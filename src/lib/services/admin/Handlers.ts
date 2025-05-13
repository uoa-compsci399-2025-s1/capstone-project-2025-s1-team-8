'use server'
import { redirect } from 'next/navigation'

export async function handleCSVDownload(semesterId: string) {
  redirect(`/api/admin/export/semesters/${semesterId}`)
}
