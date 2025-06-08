'use client'
import React from 'react'
import { useStudentPage } from '@/lib/hooks/useStudentPage'
import ProjectCardList from '@/components/Composite/ProjectCardList/ProjectCardList'
import { TeapotCard } from '@/components/Generic/TeapotCard/TeapotCard'

export const StudentPage: React.FC = () => {
  const { data: res, isLoading } = useStudentPage()
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-dark-blue text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      {res?.projects && res.projects.length > 0 ? (
        <div className="pt-35 pb-20 items-center justify-center w-full px-8 sm:px-15 lg:px-30">
          <ProjectCardList
            className="bg-muted-blue-op-45 px-7 md:px-15 pt-8 pb-12 rounded-2xl border-deeper-blue border"
            headingClassName="text-xl sm:text-2xl py-4 sm:py-6"
            heading={res.name || ''}
            projects={res.projects}
            type="student"
          />
        </div>
      ) : (
        <TeapotCard
          title="Projects haven't been published yet"
          description="Please check back at a later date!"
          center={true}
          className="pt-30"
        />
      )}
    </div>
  )
}
