import React from 'react'
import Modal from '../../Generic/Modal/Modal'
import Capsule from '@/components/Generic/Capsule/Capsule'
import { ModalProps } from '@/components/Generic/Modal/Modal'

interface ProjectModalProps extends ModalProps {
  projectTitle: string
  projectClientDetails: [string, string]
  otherClientDetails?: Array<[string, string]>
  projectDescription: string
  desiredOutput: string
  desiredTeamSkills: string
  availableResources: string

  specialRequirements: boolean
  numberOfTeams: number
  futureConsideration: boolean
  Semesters: Array<string>
  submittedDate: Date
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  open,
  onClose,
  className = '',
  projectTitle,
  projectClientDetails,
  otherClientDetails = [],
  projectDescription,
  desiredOutput,
  desiredTeamSkills,
  availableResources,
  specialRequirements,
  numberOfTeams,
  futureConsideration,
  Semesters: semesters,
  submittedDate,
}) => {
  const convertDatetoddmmYYYY = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0') // January is 0!
    const yyyy = date.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }

  const convertNumberOfTeamstoString = (numberOfTeams: number) => {
    if (numberOfTeams === 1) {
      return '1 team'
    } else {
      return `Up to ${numberOfTeams} teams`
    }
  }

  return (
    <Modal open={open} onClose={onClose} className={className + ' min-h-fit'}>
      <div className="relative max-w-full flex flex-col p-15 rounded-t-2xl gap-5 pointer-events-none">
        {/* title */}
        <h1 className="text-5xl m-0 text-dark-blue font-dm-serif-display">{projectTitle}</h1>

        {/* client details */}
        <div className="flex flex-row gap-3">
          <h2 className="flex text-steel-blue font-inter">{projectClientDetails[0]}</h2>
          <h2 className="flex text-deeper-blue font-inter">|</h2>
          <h2 className="flex text-deeper-blue font-inter">{projectClientDetails[1]}</h2>
        </div>

        {/* project description*/}
        <p className="text-sm text-dark-blue font-inter text-left">{projectDescription}</p>

        {/* desired output */}
        <Capsule variant="muted_blue" text="Desired output" />
        <p className="text-sm text-dark-blue font-inter text-left mb-5">{desiredOutput}</p>

        {/* capsules for information */}
        <div className="grid grid-cols-[max-content_auto_max-content_max-content] grid-flow-row gap-2">
          <Capsule className="col-start-1" variant="muted_blue" text="Special requirements" />
          <Capsule
            className="col-start-2"
            variant="beige"
            text={specialRequirements ? 'Yes' : 'No'}
          />

          <Capsule className="col-start-3 " variant="muted_blue" text="Submitted" />
          <Capsule
            className="col-start-4"
            variant="gradient"
            text={convertDatetoddmmYYYY(submittedDate)}
          />

          <Capsule className="col-start-1" variant="muted_blue" text="Number of teams" />
          <Capsule
            className="col-start-2"
            variant="beige"
            text={convertNumberOfTeamstoString(numberOfTeams)}
          />

          <Capsule className="col-start-1" variant="muted_blue" text="Future consideration" />
          <Capsule
            className="col-start-2"
            variant="beige"
            text={futureConsideration ? 'Yes' : 'No'}
          />

          <Capsule className="col-start-1" variant="muted_blue" text="Semesters" />
          <div className="col-start-2 col-end-[span_1] flex flex-row flex-wrap gap-2">
            {semesters.map((semester) => (
              <Capsule variant="beige" text={semester} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative bg-muted-blue-op-45 max-w-full flex flex-col p-15 rounded-b-2xl gap-5">
        <div className="flex flex-col">
          <div className="grid grid-cols-[max-content_max-content_max-content_auto] gap-x-3">
            {otherClientDetails.map((clientDetails) => (
              <>
                <h2 className="col-start-1 text-dark-blue font-inter alternate">
                  {clientDetails[0]}
                </h2>
                <h2 className="col-start-2 text-deeper-blue font-inter email">|</h2>
                <h2 className="col-start-3 text-deeper-blue font-inter email">
                  {clientDetails[1]}
                </h2>
              </>
            ))}
          </div>
        </div>
        <Capsule variant="light_beige" text="Desired team skills" />
        <p className="text-sm text-dark-blue font-inter text-left">{desiredTeamSkills}</p>
        <Capsule variant="light_beige" text="Available resources" />
        <p className="text-sm text-dark-blue font-inter text-left">{availableResources}</p>
      </div>
    </Modal>
  )
}

export default ProjectModal
