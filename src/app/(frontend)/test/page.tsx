import ProjectService from "@/lib/services/project/ProjectService"
import SemesterService from "@/lib/services/semester/SemesterService"

export default async function Test() {
    const { data, error } = await ProjectService.getNextSemesterProjects()
    const data2 = await SemesterService.getAllPaginatedProjectsBySemesterId("680396f992b5b1f3928c9e18")
    console.log(data)

  if (error) {
    return <div>Error loading projects: {error}</div>
  }
    
    return (
        <>
        <div>{JSON.stringify(data)}</div>
      </>
    )
}