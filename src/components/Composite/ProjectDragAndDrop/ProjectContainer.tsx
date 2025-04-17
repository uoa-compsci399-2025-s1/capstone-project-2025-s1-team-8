import React, { useEffect, useRef, useState } from 'react'
import { useSortable, SortableContext } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ProjectFilter from '../Filter/ProjectFilter'
import ProjectCard from '@/components/Generic/ProjectCard/ProjectCard'
import { ProjectCardType } from '@/components/Generic/ProjectCard/ProjectCard'
import { useFilter } from '@/contexts/FilterContext'
import { UniqueIdentifier } from '@dnd-kit/core'

export interface ProjectContainerType {
  id: UniqueIdentifier
  containerName?: string
  projects: ProjectCardType[]
  onChange?: (val: string) => void
  containerColor: 'light' | 'medium' | 'dark'
}

const ProjectContainer = ({
  id,
  containerName,
  projects,
  onChange,
  containerColor,
}: ProjectContainerType) => {
  const { attributes, setNodeRef, listeners, transform, isDragging } = useSortable({
    id: id,
    data: {
      type: 'container',
    },
  })

  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number | undefined>()
  const { selectedFilter } = useFilter()

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
        : 'text-dark-blue-1'
  const dividerColor =
    containerColor == 'light'
      ? 'bg-bright-blue'
      : containerColor == 'medium'
        ? 'bg-deeper-blue'
        : 'bg-dark-blue-1'
  return (
    <div
      {...attributes}
      ref={(el) => {
        setNodeRef(el)
        containerRef.current = el
      }}
      style={style}
      className={`relative w-full h-[600px] max-h-[65vh] bg-muted-blue-op-45 ring-1 ring-deeper-blue rounded-xl flex flex-col gap-y-4 ${isDragging ? 'opacity-50' : ''} overflow-auto transition-all duration-300 ease-in-out shadow-md shadow-inner`}
    >
      <div className="sticky top-0 w-full flex flex-col gap-4 items-center z-40 bg-muted-blue-op-45 p-4">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`h-6 w-6 ${dotColor}`}
                >
                  <circle cx="6" cy="12" r="5" />
                </svg>
              </span>
              <p className="text-dark-blue-5 text-md font-semibold">{containerName}</p>
            </div>

            <div className="bg-beige rounded-full flex justify-center items-center aspect-square min-w-[1.5rem] h-auto px-1.5">
              <p className="text-sm font-bold text-dark-blue-1">{projects.length}</p>
            </div>
          </div>

          <ProjectFilter containerWidth={containerWidth} />
        </div>
        <div className={`w-full h-1 ${dividerColor}`}></div>
      </div>

      <div ref={contentRef} className="flex items-center justify-between mx-4 mb-4" {...listeners}>
        <SortableContext items={projects.map((i) => i.id)}>
          <div className="flex items-start flex-col gap-y-4 w-full">
            {projects.map((i) => (
              <ProjectCard key={i.id} id={i.id} projectInfo={i.projectInfo} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default ProjectContainer
