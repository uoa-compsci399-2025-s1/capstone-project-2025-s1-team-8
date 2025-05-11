import React from 'react'
import ProjectCard from '@/components/Generic/ProjectCard/ProjectCard'
import { Project, Semester } from '@/payload-types'

interface ProjectListProps {
  className?: string
  headingClassName?: string
  heading: string
  projects: Project[]
  semesters: Semester[][]
}

const ProjectCardList: React.FC<ProjectListProps> = ({
  className,
  headingClassName,
  heading,
  projects,
  semesters,
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <h2 className={`text-dark-blue font-inter ${headingClassName}`}>{heading}</h2>

      <div className="flex flex-col gap-4 overflow-x-visible overflow-y-auto max-h-[490px] p-[1px] pt-0.5 pb-3">
        {projects.map((project, index) => (
          <ProjectCard key={index} projectInfo={project} semesters={semesters[index]} />
        ))}
      </div>
    </div>
  )
}

export default ProjectCardList
