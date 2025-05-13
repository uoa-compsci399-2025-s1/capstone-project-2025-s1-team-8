import React, { useEffect, useRef, useState } from 'react'
import { useSortable, SortableContext } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ProjectFilter from '@/components/Composite/Filter/ProjectFilter'
import DraggableProjectCard from '@/components/Generic/ProjectCard/DraggableProjectCard'
import { ProjectCardType } from '@/components/Generic/ProjectCard/DraggableProjectCard'
import { useFilter } from '@/contexts/FilterContext'
import { UniqueIdentifier } from '@dnd-kit/core'
import ProjectModal from '../ProjectModal/ProjectModal'
import { Project } from '@/payload-types'

export interface ProjectContainerType {
  id: UniqueIdentifier
  containerName?: string
  projects: ProjectCardType[]
  onChange?: (val?: string) => void
  containerColor: 'light' | 'medium' | 'dark'
}

const ProjectContainer = ({
  id,
  containerName,
  projects,
  onChange,
  containerColor,
}: ProjectContainerType) => {
  const { attributes, setNodeRef, transform, isDragging } = useSortable({
    id: id,
    data: {
      type: 'container',
    },
  })

  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number | undefined>()
  const { selectedFilter } = useFilter()
  const [openProject, setOpenProject] = useState<Project | null>(null)

  useEffect(() => {
    onChange?.(selectedFilter)
  }, [selectedFilter])

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
    }
  }, [])

  const style = {
    transform: CSS.Transform.toString(transform),
  }

  const dotColor =
    containerColor == 'light'
      ? 'text-bright-blue'
      : containerColor == 'medium'
        ? 'text-deeper-blue'
        : 'text-dark-blue'
  const dividerColor =
    containerColor == 'light'
      ? 'bg-bright-blue'
      : containerColor == 'medium'
        ? 'bg-deeper-blue'
        : 'bg-dark-blue'
  return (
    <div
      {...attributes}
      ref={(el) => {
        setNodeRef(el)
        containerRef.current = el
      }}
      style={style}
      className={`relative w-full h-[80dvh] bg-muted-blue-op-45 ring-1 ring-muted-blue rounded-2xl flex flex-col gap-y-4 ${isDragging ? 'opacity-50' : ''} overflow-auto transition-all duration-300 ease-in-out shadow-inner`}
    >
      <div className="sticky top-0 w-full flex flex-col gap-4 items-center z-40 bg-muted-blue-op-45 px-5 pt-6">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center gap-3.5 ml-[-8px]">
            <div className="flex items-center">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 8 24"
                  fill="currentColor"
                  className={`h-6 w-6 ${dotColor}`}
                >
                  <circle cx="4" cy="12" r="4" />
                </svg>
              </span>
              <p className="text-dark-blue text-base font-medium capitalize">{containerName}</p>
            </div>

            <div className="bg-beige rounded-full flex justify-center items-center aspect-square min-w-[1.5rem] h-auto px-1.5">
              <p className="text-xs font-medium text-grey-1">{projects.length}</p>
            </div>
          </div>

          <ProjectFilter containerWidth={containerWidth} />
        </div>
        <div className={`w-full h-1 ${dividerColor} rounded-lg`}></div>
      </div>

      <div ref={contentRef} className="flex items-center justify-between mx-5 mb-4">
        <SortableContext items={projects.map((i) => i.id)}>
          <div className="flex items-start flex-col gap-y-4 w-full">
            {projects.map((i) => (
              <DraggableProjectCard
                key={i.id}
                id={i.id}
                projectInfo={i.projectInfo}
                onClick={() => setOpenProject(i.projectInfo)}
              />
            ))}
          </div>
        </SortableContext>
      </div>
      {openProject && (
        <ProjectModal
          open={!!openProject}
          onClose={() => setOpenProject(null)}
          projectInfo={openProject}
        >
          Open Project
        </ProjectModal>
      )}
    </div>
  )
}

export default ProjectContainer
