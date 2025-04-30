import ProjectService from "@/lib/services/project/ProjectService";
import SemesterService from "@/lib/services/semester/SemesterService";

export default async function New() {
    const data = await SemesterService.getAllPaginatedSemesters()
    const data2 = await ProjectService.UpdateSemesterProject("68104d1a0497f84b9c5c3491", "68104d670497f84b9c5c3515", {number: 5, status: "accepted"})
    return (<div>
        {/* {JSON.stringify(data)} */}
        {JSON.stringify(data2)}
    </div>)
}