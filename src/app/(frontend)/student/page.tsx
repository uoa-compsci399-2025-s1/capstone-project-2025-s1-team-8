'use client'
import ProjectCardList from "@/components/Composite/ProjectCardList/ProjectCardList"
import { handleStudentPageLoad } from "@/lib/services/student/Handlers"
import { ProjectDetails } from "@/types/Project"
import { useEffect, useState } from "react"

export default function Student(){
    const [projects, setProjects] = useState<ProjectDetails[]>([])
    const [semesterName, setSemesterName] = useState<string>("")
    useEffect(() => {
        handleStudentPageLoad().then((res) =>{
            setSemesterName(res.name)
            setProjects(res.projects)
        })
    }, [])
    return (
        <div>
            <ProjectCardList heading={semesterName} projects={projects}/>
        </div>
    )
}