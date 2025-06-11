import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useSortable, SortableContext } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ProjectFilter from '@/components/Composite/Filter/ProjectFilter'
import DraggableProjectCard from '@/components/Generic/ProjectCard/DraggableProjectCard'
import type { ProjectCardType } from '@/components/Generic/ProjectCard/DraggableProjectCard'
import { useFilter } from '@/contexts/FilterContext'
import type { UniqueIdentifier } from '@dnd-kit/core'
import ProjectModal from '../ProjectModal/ProjectModal'
import type { ProjectDetails } from '@/types/Project'

export interface ProjectContainerType {
  id: UniqueIdentifier
  containerName?: string
  projects: ProjectCardType[]
  onChange?: (val?: string) => void
  containerColor: 'light' | 'medium' | 'dark'
  onDelete: (projectId: string) => Promise<{
    error?: string
    message?: string
  }>
  deleted: () => void
}

const ProjectContainer = ({
  id,
  containerName,
  projects,
  onChange,
  containerColor,
  onDelete,
  deleted,
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
  const [openProject, setOpenProject] = useState<ProjectDetails | null>(null)

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

  const sortableItems = useMemo(() => projects.map((i) => i.id), [projects])

  return (
    <div
      {...attributes}
      ref={(el) => {
        setNodeRef(el)
        containerRef.current = el
      }}
      style={style}
      className={`relative w-full h-[72dvh] bg-muted-blue-op-45 ring-1 ring-muted-blue rounded-2xl flex flex-col gap-y-4 ${isDragging ? 'opacity-50' : ''} overflow-auto transition-all duration-300 ease-in-out shadow-inner`}
    >
      <div className="sticky top-0 w-full flex flex-col gap-3 items-center z-40 bg-muted-blue-op-45 px-[20px] pt-[25px]">
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
              <p className="text-dark-blue text-[16px] leading-none font-medium capitalize">
                {containerName}
              </p>
            </div>

            <div className="bg-beige rounded-full flex justify-center items-center aspect-square min-w-[1.3rem] h-[1.3rem]">
              <p className="text-[12px] font-medium text-grey-1">{projects.length}</p>
            </div>
          </div>

          <ProjectFilter containerWidth={containerWidth} />
        </div>
        <div className={`w-full h-1 ${dividerColor} rounded-lg`}></div>
      </div>

      <div ref={contentRef} className="flex items-center justify-between mx-[20px] mb-4">
        <SortableContext id={`sortable-context-${id}`} items={sortableItems}>
          <div className="flex items-start flex-col gap-y-[15px] w-full">
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
          semesters={openProject.semesters}
          onDelete={onDelete}
          deleted={deleted}
        >
          Open Project
        </ProjectModal>
      )}
    </div>
  )
}

export default ProjectContainer
