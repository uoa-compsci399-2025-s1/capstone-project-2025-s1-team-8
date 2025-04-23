import React, { useState } from 'react'
import Modal from '@/components/Generic/Modal/Modal'
import Capsule from '@/components/Generic/Capsule/Capsule'
import { ModalProps } from '@/components/Generic/Modal/Modal'
import { FiCheck, FiCopy } from 'react-icons/fi'
import Button from '@/components/Generic/Button/Button'
import EditDropdown from '@/components/Composite/EditDropdown/EditDropdown'

export interface ClientProps {
  name: string
  email: string
}

interface ProjectModalProps extends ModalProps {
  projectTitle: string
  projectClientDetails: ClientProps
  otherClientDetails?: Array<ClientProps>
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
  const [copied, setCopied] = useState(false)
  const [copiedAll, setCopiedAll] = useState(false)

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const handleCopyAll = (projectClientDetails: ClientProps, otherClientDetails: ClientProps[]) => {
    const allEmails = [
      projectClientDetails.email,
      ...otherClientDetails.map((client) => client.email),
    ].join(', ')
    navigator.clipboard.writeText(allEmails)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1000)
  }

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
    <Modal open={open} onClose={onClose} className={className + ' min-h-fit w-[75%] top-5'}>
      <div className="relative max-w-full flex flex-col p-15 pt-19 rounded-t-2xl gap-5 pointer-events-none">
        {/* edit button */}
        <button
          className="absolute top-10 right-20 text-dark-blue hover:text-steel-blue cursor-pointer"
          style={{ pointerEvents: 'initial' }}
          aria-label="Edit"
        >
          <EditDropdown containerWidth={200} />
        </button>

        {/* title */}
        <h1 className="text-4xl font-normal m-0 text-dark-blue font-dm-serif-display">
          {projectTitle}
        </h1>

        {/* client details */}
        <div className="flex flex-row gap-3">
          <h2 className="flex text-lg font-normal text-steel-blue font-inter">
            {projectClientDetails.name}
          </h2>
          <h2 className="flex text-lg font-normal text-deeper-blue font-inter">|</h2>
          <h2 className="flex text-lg font-normal text-deeper-blue font-inter">
            {projectClientDetails.email}
          </h2>
          <button
            className="flex"
            style={{ pointerEvents: 'initial' }}
            onClick={() => handleCopy(projectClientDetails.email)}
          >
            {copied ? (
              <FiCheck className="self-center size-5.5 text-dark-blue" />
            ) : (
              <FiCopy className="self-center size-5.5 text-steel-blue hover:text-dark-blue cursor-pointer" />
            )}
          </button>
        </div>

        {/* project description*/}
        <p className="text-sm text-dark-blue font-inter text-left pb-3">{projectDescription}</p>

        {/* desired output */}
        <Capsule variant="muted_blue" text="Desired output" />
        <p className="text-sm text-dark-blue font-inter text-left mb-7">{desiredOutput}</p>

        {/* capsules for information */}
        <div className="grid grid-cols-[max-content_auto_max-content_max-content] grid-flow-row gap-2.5">
          <Capsule className="col-start-1 mr-2" variant="muted_blue" text="Special requirements" />
          <Capsule
            className="col-start-2"
            variant="beige"
            text={specialRequirements ? 'Yes' : 'No'}
          />

          <Capsule className="col-start-3 mr-2" variant="muted_blue" text="Submitted" />
          <Capsule
            className="col-start-4 mr-2"
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
              <Capsule variant="beige" text={semester} key={semester} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative bg-transparent-blue max-w-full flex flex-col px-15 pt-12 py-19 rounded-b-2xl gap-5">
        <div className="flex flex-col">
          <div
            className={`grid grid-cols-[max-content_max-content_max-content_auto_max-content] grid-rows-${otherClientDetails.length} gap-x-3 pb-3`}
          >
            {otherClientDetails.map((clientDetails) => (
              <>
                <h2 className="col-start-1 text-lg font-normal text-dark-blue font-inter alternate">
                  {clientDetails.name}
                </h2>
                <h2 className="col-start-2 text-lg font-normal text-deeper-blue font-inter email">
                  |
                </h2>
                <h2 className="col-start-3 text-lg font-normal text-deeper-blue font-inter email">
                  {clientDetails.email}
                </h2>
              </>
            ))}

            <Button
              onClick={() => handleCopyAll(projectClientDetails, otherClientDetails)}
              className="col-start-5 row-start-1"
              variant="muted_blue"
              size="sm"
            >
              {copiedAll ? <FiCheck className="self-center size-4" /> : <p>Copy All Emails</p>}
            </Button>
          </div>
        </div>
        <Capsule variant="light_beige" text="Desired team skills" />
        <p className="text-sm text-dark-blue font-inter text-left mb-3">{desiredTeamSkills}</p>
        <Capsule variant="light_beige" text="Available resources" />
        <p className="text-sm text-dark-blue font-inter text-left">{availableResources}</p>
      </div>
    </Modal>
  )
}

export default ProjectModal
