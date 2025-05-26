import React, { useState } from 'react'
import Capsule from '@/components/Generic/Capsule/Capsule'
import type { ModalProps } from '@/components/Generic/Modal/Modal'
import Modal from '@/components/Generic/Modal/Modal'
import { FiCheck, FiCopy, FiSave } from 'react-icons/fi'
import ProjectCardList from '@/components/Composite/ProjectCardList/ProjectCardList'
import EditDropdown from '@/components/Composite/EditDropdown/EditDropdown'
import type { ProjectDetails } from '@/types/Project'
import Notification from '@/components/Generic/Notification/Notification'
import type { UserCombinedInfo } from '@/types/Collections'

interface ClientModalProps extends ModalProps {
  clientInfo: UserCombinedInfo
  clientEmail: string
  projects?: ProjectDetails[]
  onSave?: (
    clientId: string,
    firstName: string,
    lastName: string,
    affiliation: string,
    introduction: string,
  ) => Promise<{
    data?: UserCombinedInfo
    error?: string
    message?: string
    details?: string
  }>
  onUpdated?: () => void
  onDeleted?: () => void
}

const ClientModal: React.FC<ClientModalProps> = ({
  open,
  onClose,
  className = '',
  clientInfo,
  clientEmail,
  projects,
  onSave,
  onUpdated,
  // onDeleted,
}) => {
  // @TODO implement firstName and lastName separately input

  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [name, setName] = useState<string>(clientInfo.firstName + ' ' + clientInfo.lastName)
  const [previousName, setPreviousName] = useState<string>(
    clientInfo.firstName + ' ' + clientInfo.lastName,
  )
  const [affiliation, setAffiliation] = useState<string>(clientInfo.affiliation ?? '')
  const [previousAffiliation, setPreviousAffiliation] = useState<string>(
    clientInfo.affiliation ?? '',
  )
  const [introduction, setIntroduction] = useState<string>(clientInfo.introduction ?? '')
  const [previousIntroduction, setPreviousIntroduction] = useState<string>(
    clientInfo.introduction ?? '',
  )
  const [notificationMessage, setNotificationMessage] = useState<string>('')
  const [notificationType, setNotificationType] = useState<'success' | 'warning' | undefined>(
    'warning',
  )
  const [notificationTitle, setNotificationTitle] = useState<string>('')

  const handleSave = async () => {
    const names = name.split(' ')
    const firstName = names[0]
    const lastName = names[1]
    if (!firstName || !lastName) {
      setNotificationType('warning')
      setNotificationTitle('Issue updating profile')
      setNotificationMessage('Please enter a valid first and last name.')
      return
    }

    if (names.length > 2) {
      setNotificationType('warning')
      setNotificationTitle('Issue updating profile')
      setNotificationMessage('Please enter only first and last name.')
      return
    }
    if (onSave) {
      const res = await onSave(clientInfo.id, firstName, lastName, affiliation, introduction)
      if (res.error) {
        setName(previousName)
        setAffiliation(previousAffiliation)
        setIntroduction(previousIntroduction)
        setNotificationType('warning')
        setNotificationTitle('Issue updating profile')
        setNotificationMessage(
          'Error updating profile: ' + ((res.error ?? '') || (res.details ?? '')),
        )
        return
      }
    }
    setPreviousName(name)
    setPreviousAffiliation(affiliation)
    setPreviousIntroduction(introduction)
    setIsEditing(false)
    setNotificationType('success')
    setNotificationTitle('Success')
    setNotificationMessage('Client updated successfully')
    onUpdated?.()
  }

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        setNotificationMessage('')
        setIsEditing(false)
        onClose?.()
      }}
      className={className + ' min-h-fit w-[75%] top-5'}
    >
      <div className="fixed top-6 right-6 z-50">
        <Notification
          isVisible={notificationMessage !== ''}
          title={notificationTitle}
          message={notificationMessage}
          type={notificationType}
          onClose={() => {
            setNotificationMessage('')
          }}
        />
      </div>
      <div className="relative max-w-full flex flex-col p-15 py-19 rounded-t-2xl gap-5 pointer-events-none">
        <button
          className="absolute top-8 right-16 sm:top-10 sm:right-20 text-dark-blue hover:text-steel-blue cursor-pointer"
          aria-label="Edit"
          style={{ pointerEvents: 'initial' }}
        >
          {isEditing ? (
            <FiSave
              className="w-5 h-5 text-dark-blue hover:text-steel-blue top-11.5 right-10"
              onClick={handleSave}
            />
          ) : (
            <EditDropdown
              containerWidth={200}
              onEdit={() => {
                setIsEditing(true)
              }}
            />
          )}
        </button>
        <div className="flex flex-row gap-5">
          {isEditing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="editable-capsule"
              style={{ pointerEvents: 'initial' }}
            />
          ) : (
            <h1 className="text-4xl font-normal m-0 text-dark-blue font-dm-serif-display">
              {name}
            </h1>
          )}
          <h2 className="text-lg font-normal text-steel-blue font-inter self-end pb-0.5">
            {clientEmail}
          </h2>
          <button
            className="flex pb-1 ml-[-4px]"
            style={{ pointerEvents: 'initial' }}
            onClick={() => handleCopy(clientEmail)}
          >
            {copied ? (
              <FiCheck className="self-end size-5.5 text-dark-blue" />
            ) : (
              <FiCopy className="self-end size-5.5 text-steel-blue hover:text-dark-blue cursor-pointer" />
            )}
          </button>
        </div>
        {(affiliation || isEditing) && (
          <div className="flex flex-row gap-3 items-center mb-6">
            <Capsule variant="muted_blue" text="Affiliation" />
            {isEditing ? (
              <input
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                className="editable-capsule"
                placeholder="Add affiliation"
                style={{ pointerEvents: 'initial' }}
              />
            ) : (
              affiliation && <Capsule variant="beige" text={affiliation} />
            )}
          </div>
        )}
        {(introduction || isEditing) && (
          <>
            <Capsule variant="muted_blue" text="Introduction" />
            {isEditing ? (
              <textarea
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                className="editable-capsule h-24 w-full p-2"
                placeholder="Add introduction"
                style={{ pointerEvents: 'initial' }}
              />
            ) : (
              introduction && (
                <p className="text-dark-blue font-inter text-sm whitespace-pre-wrap">
                  {introduction}
                </p>
              )
            )}
          </>
        )}
      </div>
      {projects && (
        <ProjectCardList
          className="bg-transparent-blue border-t-deeper-blue border-t max-w-full flex flex-col p-15 rounded-b-2xl gap-5"
          headingClassName="text-3xl pb-3 tracking-wide"
          heading="Projects"
          projects={projects}
        />
      )}
    </Modal>
  )
}

export default ClientModal
