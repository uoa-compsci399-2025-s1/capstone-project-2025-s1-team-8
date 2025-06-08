'use client'
import React, { useState, useRef, useEffect } from 'react'
import Capsule from '@/components/Generic/Capsule/Capsule'
import EditDeleteDropdown from '@/components/Composite/EditDropdown/EditDeleteDropdown'
import ProjectCardList from '@/components/Composite/ProjectCardList/ProjectCardList'
import { XMarkIcon } from '@heroicons/react/24/solid'
import type { Semester } from '@/payload-types'
import type { ProjectDetails } from '@/types/Project'
import { FiDownload } from 'react-icons/fi'
import { formatDate } from '@/utils/date'
import { useSemesterProjects } from '@/lib/hooks/useSemesterProjects'
import { useQueryClient } from '@tanstack/react-query'

interface SemesterCardProps extends Semester {
  semester: Semester
  currentOrUpcoming?: 'current' | 'upcoming' | ''
  onEdit?: (id: string) => void
  onDeleteProject: (projectId: string) => Promise<{
    error?: string
    message?: string
  }>
  deletedProject: () => void
  onDeleteSemester: (semesterId: string) => Promise<void | {
    error?: string
    message?: string
  }>
  deletedSemester?: () => void
}
const SemesterCard: React.FC<SemesterCardProps> = ({
  semester,
  currentOrUpcoming,
  onEdit,
  onDeleteProject,
  deletedProject,
  onDeleteSemester,
  deletedSemester,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState('0px')
  const { data: semesterProjectsData, isLoading } = useSemesterProjects(semester.id)

  const queryClient = useQueryClient()

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`)
    } else {
      setHeight('0px')
    }
  }, [isOpen, isLoading])

  function handleDownloadCsv() {
    window.open(`/api/admin/export/semesters/${semester.id}`, '_blank')
  }

  return (
    <div className="relative w-full flex flex-col gap-4">
      {/* Semester Card */}
      <div
        onClick={async () => {
          setIsOpen(!isOpen)
        }} // should load projects
        className={`
      ${
        currentOrUpcoming === 'upcoming' || currentOrUpcoming === 'current'
          ? 'bg-muted-blue-op-45 hover:bg-[#d2e3e1]'
          : 'bg-gradient-to-r from-denim-blue to-deeper-blue hover:from-[#35474c] hover:to-[#6d939d]'
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
          {semester.name}
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
            text={formatDate(semester.startDate)}
            variant="muted_blue"
            className="small-info-tag"
          />
          <Capsule
            text={formatDate(semester.endDate)}
            variant="muted_blue"
            className="small-info-tag"
          />
        </div>
      </div>

      {/* Expandable Details */}
      <div
        className={`relative w-full bg-muted-blue-op-45 ring-1 ring-deeper-blue rounded-lg transition-all duration-500 overflow-hidden ${isOpen ? 'opacity-100 mt-8 mb-12' : 'opacity-0'}`}
        style={{ maxHeight: height }}
      >
        <div ref={contentRef} className="px-10 py-8 sm:px-14 sm:py-12 overflow-hidden">
          {/* Close Button */}
          <button
            className="absolute top-8 right-8 text-steel-blue hover:text-deep-teal cursor-pointer"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Edit Button */}
          <button
            className="absolute top-8.25 right-19 text-steel-blue hover:text-deep-teal cursor-pointer"
            aria-label="Edit"
          >
            <EditDeleteDropdown
              containerWidth={200}
              onEdit={() => onEdit?.(semester.id)}
              onDelete={() => {
                onDeleteSemester?.(semester.id)
                deletedSemester?.()
              }}
            />
          </button>

          {/* Details Section */}
          <div className="pb-4 sm:pb-6">
            <h2 className="text-2xl sm:text-3xl text-dark-blue font-dm-serif-display py-4">
              {semester.name}
            </h2>

            <div className="grid grid-cols-[auto_1fr] grid-rows-3 gap-3 py-3 text-sm sm:text-base">
              <Capsule text="Starts" variant="muted_blue" className="small-info-tag pb-0.5" />
              <Capsule
                text={formatDate(semester.startDate)}
                variant="beige"
                className="small-info-tag pb-0.5"
              />
              <Capsule text="Ends" variant="muted_blue" className="small-info-tag pb-0.5" />
              <Capsule
                text={formatDate(semester.endDate)}
                variant="beige"
                className="small-info-tag pb-0.5"
              />
              <Capsule
                text="Submission deadline"
                variant="muted_blue"
                className="small-info-tag pb-0.5"
              />
              <Capsule
                text={formatDate(semester.deadline)}
                variant="beige"
                className="small-info-tag pb-0.5"
              />
            </div>
          </div>

          {/* Projects Section */}
          <ProjectCardList
            className="pb-1"
            headingClassName="text-xl sm:text-2xl py-4 sm:py-6"
            heading="Approved projects"
            projects={semesterProjectsData || []}
            onDelete={onDeleteProject}
            deleted={async () => {
              deletedProject()
              queryClient.invalidateQueries({ queryKey: ['semesterProjects', semester.id] })
            }}
            icon={<FiDownload />}
            loading={isLoading}
            onClick={handleDownloadCsv}
          />
        </div>
      </div>
    </div>
  )
}

export default SemesterCard
