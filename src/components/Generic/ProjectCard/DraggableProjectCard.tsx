import { UniqueIdentifier } from '@dnd-kit/core'
import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BsThreeDots } from 'react-icons/bs'
import { ProjectDetailsType } from '@/types/Project'

export interface ProjectCardType {
  id: UniqueIdentifier
  projectInfo: ProjectDetailsType
  onClick?: () => void
}

const DraggableProjectCard = ({ id, projectInfo, onClick }: ProjectCardType) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id,
    data: {
      type: 'item',
    },
  })
  const truncatedDescription = projectInfo.projectDescription.slice(0, 80) + '...'

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 200ms ease',
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className={`relative w-full bg-light-beige rounded-2xl ring-1 ring-deeper-blue p-5 overflow-hidden group transition-all duration-300 ease-in-out ${
        isDragging ? 'opacity-50' : 'hover:shadow-md'
      }`}
    >
      <button {...listeners} className={`text-left cursor-grab`}>
        <div className="absolute inset-0 bg-gradient-to-t from-bright-blue to-light-beige opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-0 rounded-2xl" />
        <div className="relative z-10">
          <p className="text-dark-blue text-base font-semibold pb-0.5">
            {projectInfo.projectTitle}
          </p>
          <p className="text-dark-blue text-sm">
            {projectInfo.projectClientDetails.firstName} {projectInfo.projectClientDetails.lastName}
          </p>
          <p className="text-grey-1 py-2 text-xs">{truncatedDescription}</p>
        </div>
      </button>

      <button
        className="absolute top-5 right-5 text-dark-blue hover:text-steel-blue cursor-pointer focus:outline-none z-20"
        onClick={onClick}
      >
        <BsThreeDots className="size-5 pr-1" />
      </button>
    </div>
  )
}
export default DraggableProjectCard
