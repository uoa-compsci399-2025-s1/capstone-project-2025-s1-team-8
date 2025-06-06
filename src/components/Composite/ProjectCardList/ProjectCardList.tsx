import React from 'react'
import ProjectCard from '@/components/Generic/ProjectCard/ProjectCard'
import type { ProjectDetails } from '@/types/Project'

interface ProjectListProps {
  className?: string
  headingClassName?: string
  heading: string
  projects: ProjectDetails[]
  type?: 'student' | 'admin' | 'client'
}

const ProjectCardList: React.FC<ProjectListProps> = ({
  className,
  headingClassName,
  heading,
  projects,
  type = 'admin',
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <h2 className={`text-dark-blue font-inter ${headingClassName}`}>{heading}</h2>

      <div className="flex flex-col gap-4 overflow-x-visible overflow-y-auto max-h-[490px] p-[1px] pt-0.5 pb-3">
        {projects.map((project, index) => (
          <ProjectCard key={index} projectInfo={project} type={type} />
        ))}
      </div>
    </div>
  )
}

export default ProjectCardList
