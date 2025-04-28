import SemesterService from '@/lib/services/semester/SemesterService'

export default async function NewComponent() {
  const data = await SemesterService.getAllPaginatedSemesters()
  const data2 = await SemesterService.getAllPaginatedProjectsBySemesterId(
    '649b0f1c4a2d3e001c5f8b7d',
  )
  const data3 = await SemesterService.createSemester({
    name: 'Test Semester 2',
    startDate: '2023-10-01',
    endDate: '2024-01-01',
    deadline: '2023-12-01',
  })
  const data4 = await SemesterService.updateSemester('680f1392999aa04b1ae6943b', {
    name: 'Updated Semester',
    startDate: '2023-10-01',
    endDate: '2024-01-01',
    deadline: '2023-12-01',
  })

  return (
    <div>
      {JSON.stringify(data)}
      {JSON.stringify(data2)}
      {JSON.stringify(data3)}
      {JSON.stringify(data4)}
    </div>
  )
}
