import type { UniqueIdentifier } from '@dnd-kit/core'
import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BsThreeDots } from 'react-icons/bs'
import type { UserCombinedInfo } from '@/types/Collections'
import type { ProjectDetails } from '@/types/Project'

export interface ProjectCardType {
  id: UniqueIdentifier
  projectInfo: ProjectDetails
  onClick?: () => void
}

const DraggableProjectCard = ({ id, projectInfo, onClick }: ProjectCardType) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id,
    data: {
      type: 'item',
    },
  })
  const truncatedDescription =
    projectInfo.description?.length > 80
      ? projectInfo.description.slice(0, 80) + '...'
      : projectInfo.description

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
      className={`relative w-full bg-light-beige rounded-2xl ring-1 ring-deeper-blue p-5 px-[20px] overflow-hidden group transition-all duration-300 ease-in-out ${
        isDragging ? 'opacity-50' : 'hover:shadow-md'
      }`}
    >
      <button {...listeners} className={`text-left cursor-grab`}>
        <div className="absolute inset-0 bg-gradient-to-t from-bright-blue to-light-beige opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-0 rounded-2xl" />
        <div className="relative z-10">
          <p className="text-dark-blue text-[16px] leading-none font-semibold pt-1 pb-1.5">
            {projectInfo.name}
          </p>
          <p className="text-dark-blue text-xs pb-0.5">
            {(projectInfo.client as UserCombinedInfo)?.firstName +
              ' ' +
              ((projectInfo.client as UserCombinedInfo)?.lastName ?? '')}
          </p>
          <p className="text-grey-1 p-0 pt-2 pb-1 text-[12px] leading-none">
            {truncatedDescription}
          </p>
        </div>
      </button>

      <button
        className="absolute top-5 right-5 text-dark-blue hover:text-steel-blue cursor-pointer focus:outline-none z-20"
        onClick={onClick}
      >
        <BsThreeDots className="size-4 pr-0.5" />
      </button>
    </div>
  )
}
export default DraggableProjectCard
