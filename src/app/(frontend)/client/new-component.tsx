import { getAllSemesters } from "@/services/semesterApiService"

export default async function NewComponent() {
  const data = await getAllSemesters()

  return <div>{JSON.stringify(data)}</div>
}
