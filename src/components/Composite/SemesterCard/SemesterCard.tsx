'use client'
import React, { useState, useRef, useEffect } from 'react'
import { ProjectDTOPlaceholder } from '@/components/Generic/ProjectCard/ProjectCard'
import SemesterProjectCard from '@/components/Generic/ProjectCard/SemesterProjectCard'
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
  const [height, setHeight] = useState('0px')

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`)
    } else {
      setHeight('0px')
    }
  }, [isOpen])

  return (
    <div className="relative w-full flex flex-col gap-4">
      {/* Semester Card */}
      <div
        onClick={() => setIsOpen(true)}
        className={`
      ${
        currentOrUpcoming === 'upcoming' || currentOrUpcoming === 'current'
          ? 'bg-muted-blue-op-45'
          : 'bg-gradient-to-r from-denim-blue to-deeper-blue'
      }
      rounded-lg ring-1 ring-deeper-blue p-4 sm:p-6 cursor-pointer hover:shadow-md
      flex flex-col gap-3 relative
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
          <div className="info-tag-beige uppercase absolute top-4 sm:top-6 right-4 sm:right-6 text-xs sm:text-sm">
            {currentOrUpcoming}
          </div>
        )}

        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <div className="info-tag-blue">{new Date(startDate).toLocaleDateString()}</div>
          <div className="info-tag-blue">{new Date(endDate).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Expandable Details */}
      <div
        onClick={() => setIsOpen(false)}
        className={`relative w-full cursor-pointer bg-muted-blue-op-45 ring-1 ring-deeper-blue rounded-lg transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ maxHeight: height }}
      >
        <div ref={contentRef} className="p-4 sm:p-8 overflow-hidden">
          {/* Close Button */}
          <button
            className="absolute top-4 sm:top-8 right-4 sm:right-8 text-steel-blue hover:text-deep-teal cursor-pointer"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Details Section */}
          <div className="pb-6 sm:pb-10">
            <h2 className="text-2xl sm:text-3xl text-dark-blue font-dm-serif-display py-4">
              {semesterName}
            </h2>

            <div className="grid grid-cols-[auto_1fr] grid-rows-3 gap-4 py-3 text-sm sm:text-base">
              <div className="info-tag-blue">Starts</div>
              <div className="info-tag-beige">{new Date(startDate).toLocaleDateString()}</div>
              <div className="info-tag-blue">Ends</div>
              <div className="info-tag-beige">{new Date(endDate).toLocaleDateString()}</div>
              <div className="info-tag-blue">Submission deadline</div>
              <div className="info-tag-beige">
                {new Date(submissionDeadline).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <h2 className="text-xl sm:text-2xl text-dark-blue font-inter py-4 sm:py-6">
            Approved projects
          </h2>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] sm:max-h-[400px] p-1">
            {approvedProjects.map((project, index) => (
              <SemesterProjectCard key={index} projectInfo={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SemesterCard
