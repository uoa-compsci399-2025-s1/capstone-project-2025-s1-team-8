import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import Button from '../../Generic/Button/Button'
import Modal from '../../Generic/Modal/Modal'
import Capsule from '@/components/Generic/Capsule/Capsule'
import { XMarkIcon } from '@heroicons/react/16/solid'
import { ModalProps } from '@/components/Generic/Modal/Modal'
import { number } from 'node_modules/payload/dist/fields/validations'

interface ProjectDetailProps extends ModalProps{
  projectTitle: string,
  projectClientDetails: [string, string],
  otherClientDetails?: Array<[string, string]>,
  projectDescription: string,
  desiredOutput: string,
  desiredTeamSkills: string,
  availableResources: string,

  specialRequirements: boolean,
  numberOfTeams: number,
  futureConsideration: boolean,
  Semesters: Array<string>,
  submittedDate: Date,
}

const ProjectDetails: React.FC<ProjectDetailProps> = ({ 
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
  // modal component closes when clicking outside of the modal
  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const convertDatetoddmmYYYY = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0') // January is 0!
    const yyyy = date.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }

  const convertNumberOfTeamstoString = (numberOfTeams: number) => {
    if (numberOfTeams === 1) {
      return "1 team"
    } else {
      return `Up to ${numberOfTeams} teams`
    }
  }

  return (
    <Modal open={open} onClose={onClose} className={className + " min-h-fit"}>
      <div className={`relative max-w-full flex flex-col p-15 rounded-t-2xl gap-5 pointer-events-none`}>

        {/* title */}
        <h1 className={`modal-title`}>{projectTitle}</h1>

        {/* client details */}
        <div className={`flex flex-row gap-3`}>
          <h2 className={`flex modal-client`}>{projectClientDetails[0]}</h2>
          <h2 className={`flex modal-client email`}>|</h2>
          <h2 className={`flex modal-client email`}>{projectClientDetails[1]}</h2>
        </div>

        {/* project description*/}
        <p className={`modal-text`}>{projectDescription}</p>

        {/* desired output */}
        <Capsule className="" variant='muted_blue' text="Desired output" />
        <p className={`modal-text mb-5`}>{desiredOutput}</p>
        
        {/* capsules for information */}
        <div className={`grid grid-cols-[max-content_auto_max-content_max-content] grid-flow-row gap-2`}>
          <Capsule className="col-start-1" variant="muted_blue" text="Special requirements" />
          <Capsule className="col-start-2" variant="beige" text={specialRequirements ? "Yes" : "No"} />
          <Capsule className="col-start-3 " variant="muted_blue" text="Submitted" />
          <Capsule className="col-start-4" variant="gradient" text={convertDatetoddmmYYYY(submittedDate)} />
          <Capsule className="col-start-1" variant="muted_blue" text="Number of teams" />
          <Capsule className="col-start-2" variant="beige" text={convertNumberOfTeamstoString(numberOfTeams)} />
          <Capsule className="col-start-1" variant="muted_blue" text="Future consideration" />
          <Capsule className="col-start-2" variant="beige" text={futureConsideration ? "Yes" : "No"} />
          <Capsule className="col-start-1" variant="muted_blue" text="Semesters" />
          <div className="col-start-2 col-end-[span_1] flex flex-row flex-wrap gap-2">
            {
              semesters.map((semester, index) => (
                <Capsule key={index} variant="beige" text={semester} />
              ))
            }
          </div>
        </div>
      </div>

      <div className={`relative bg-muted-blue-op-45 max-w-full flex flex-col p-15 rounded-b-2xl gap-5`}>
        <div className={`flex flex-col`}>
          <div className={`grid grid-cols-[max-content_max-content_max-content_auto] gap-x-3`}>
          {
            otherClientDetails.map((clientDetails, index) => (
              <>
                <h2 className={`col-start-1 modal-client alternate`}>{clientDetails[0]}</h2>
                <h2 className={`col-start-2 modal-client email`}>|</h2>
                <h2 className={`col-start-3 modal-client email`}>{clientDetails[1]}</h2>
              </>
            ))
          }
          </div>
        </div>
        <Capsule variant="light_beige" text="Desired team skills"/>
        <p className={`modal-text`}>{desiredTeamSkills}</p>
        <Capsule variant="light_beige" text="Available resources"/>
        <p className={`modal-text`}>{availableResources}</p>
      </div>
    </Modal>
  )
}

export default ProjectDetails
