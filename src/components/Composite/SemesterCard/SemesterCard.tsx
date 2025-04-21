'use client'
import React, { useState, useRef, useEffect } from 'react'
import { ProjectDTOPlaceholder } from '@/components/Generic/ProjectCard/DraggableProjectCard'
import ProjectCard from '@/components/Generic/ProjectCard/ProjectCard'
import Capsule from '@/components/Generic/Capsule/Capsule'
import { XMarkIcon } from '@heroicons/react/24/solid'

export interface SemesterCardProps {
  semesterName: string
  startDate: Date
  endDate: Date
  submissionDeadline: Date
  approvedProjects: ProjectDTOPlaceholder[]
  currentOrUpcoming?: 'current' | 'upcoming' | string //Used for styling the current and upcoming semesters. If not current or upcoming semester, leave blank
}

const SemesterCard: React.FC<SemesterCardProps> = ({
  semesterName,
  startDate,
  endDate,
  submissionDeadline,
  approvedProjects,
  currentOrUpcoming = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState('0px');


  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight('0px');
    }
  }, [isOpen]);

  return (
    <div className="relative w-full flex flex-col gap-4">
      {/* Semester Card */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
      ${
        currentOrUpcoming === 'upcoming' || currentOrUpcoming === 'current'
          ? 'bg-muted-blue-op-45'
          : 'bg-gradient-to-r from-denim-blue to-deeper-blue'
      }
      rounded-lg ring-1 ring-deeper-blue p-4 py-5 sm:p-6 sm:py-7 cursor-pointer hover:shadow-md
      flex flex-col gap-2.5 relative
    `}
      >
        <p
          className={`${
            currentOrUpcoming === 'upcoming' || currentOrUpcoming === 'current'
              ? 'text-dark-blue'
              : 'text-white'
          } text-base sm:text-lg font-semibold`}
        >
          {semesterName}
        </p>

        {currentOrUpcoming && (
          <Capsule
            text={currentOrUpcoming}
            variant="beige"
            className="uppercase absolute top-5 sm:top-8 right-4 sm:right-6 text-xs pb-[3px]"
          />
        )}

        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <Capsule
            text={new Date(startDate).toLocaleDateString()}
            variant="muted_blue"
            className="small-info-tag"
          />
          <Capsule
            text={new Date(endDate).toLocaleDateString()}
            variant="muted_blue"
            className="small-info-tag"
          />
        </div>
      </div>

      {/* Expandable Details */}
      <div
        className={`relative w-full bg-muted-blue-op-45 ring-1 ring-deeper-blue rounded-lg transition-all duration-500 overflow-hidden ${isOpen ? 'opacity-100 mt-8 mb-4' : 'opacity-0'}`}
        style={{maxHeight : height}}
      >
        <div ref={contentRef} className="md:p-12 p-6 overflow-hidden">
          {/* Close Button */}
          <button
            className="absolute top-8 right-8 text-steel-blue hover:text-deep-teal cursor-pointer"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Details Section */}
          <div className="pb-4 sm:pb-6">
            <h2 className="text-2xl sm:text-3xl text-dark-blue font-dm-serif-display py-4">
              {semesterName}
            </h2>

            <div className="grid grid-cols-[auto_1fr] grid-rows-3 gap-3 py-3 text-sm sm:text-base">
              <Capsule text="Starts" variant="muted_blue" className="small-info-tag pb-0.5" />
              <Capsule
                text={new Date(startDate).toLocaleDateString()}
                variant="beige"
                className="small-info-tag pb-0.5"
              />
              <Capsule text="Ends" variant="muted_blue" className="small-info-tag pb-0.5" />
              <Capsule
                text={new Date(endDate).toLocaleDateString()}
                variant="beige"
                className="small-info-tag pb-0.5"
              />
              <Capsule
                text="Submission deadline"
                variant="muted_blue"
                className="small-info-tag pb-0.5"
              />
              <Capsule
                text={new Date(submissionDeadline).toLocaleDateString()}
                variant="beige"
                className="small-info-tag pb-0.5"
              />
            </div>
          </div>

          {/* Projects Section */}
          <h2 className="text-xl sm:text-2xl text-dark-blue font-inter py-4 sm:py-6">
            Approved projects
          </h2>
          <div className="flex flex-col gap-4 overflow-x-visible overflow-y-auto max-h-[490px] p-[1px] pb-3 sm:pb-4">
            {approvedProjects.map((project, index) => (
              <ProjectCard key={index} projectInfo={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SemesterCard
