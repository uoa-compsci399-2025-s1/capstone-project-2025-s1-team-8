import React from 'react'
import ProjectCard from '@/components/Generic/ProjectCard/ProjectCard'
import type { ProjectDetails } from '@/types/Project'

interface ProjectListProps {
  className?: string
  headingClassName?: string
  heading: string
  projects: ProjectDetails[]
  type?: 'student' | 'admin'
  onDelete: (projectId: string) => Promise<{
    error?: string
    message?: string
  }>
  deleted?: () => void
}

const ProjectCardList: React.FC<ProjectListProps> = ({
  className,
  headingClassName,
  heading,
  projects,
  type = 'admin',
  onDelete,
  deleted,
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <h2 className={`text-dark-blue font-inter ${headingClassName}`}>{heading}</h2>

      <div className="flex flex-col gap-4 overflow-x-visible overflow-y-auto max-h-[490px] p-[1px] pt-0.5 pb-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            projectInfo={project}
            type={type}
            onDelete={onDelete}
            deleted={deleted}
          />
        ))}
      </div>
    </div>
  )
}

export default ProjectCardList
