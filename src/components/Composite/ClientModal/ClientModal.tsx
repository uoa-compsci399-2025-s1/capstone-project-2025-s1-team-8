import React, { useState } from 'react'
import Capsule from '@/components/Generic/Capsule/Capsule'
import type { ModalProps } from '@/components/Generic/Modal/Modal'
import Modal from '@/components/Generic/Modal/Modal'
import { FiCheck, FiCopy, FiSave } from 'react-icons/fi'
import ProjectCardList from '@/components/Composite/ProjectCardList/ProjectCardList'
import EditDeleteDropdown from '@/components/Composite/EditDropdown/EditDeleteDropdown'
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
  onDeleteClient: (clientId: string) => Promise<{
    error?: string
    message?: string
  }>
  onDeletedClient?: () => void
  onUpdatedClient?: () => void
  onDeleteProject: (projectId: string) => Promise<{
    error?: string
    message?: string
  }>
  deletedProject?: () => void
}

const ClientModal: React.FC<ClientModalProps> = ({
  open,
  onClose,
  className = '',
  clientInfo,
  clientEmail,
  projects,
  onSave,
  onDeleteClient,
  onDeletedClient,
  onUpdatedClient,
  onDeleteProject,
  deletedProject,
}) => {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [firstName, setFirstName] = useState<string>(clientInfo.firstName)
  const [lastName, setLastName] = useState<string>(clientInfo.lastName ?? '')
  const [previousFirstName, setPreviousFirstName] = useState<string>(clientInfo.firstName)
  const [previousLastName, setPreviousLastName] = useState<string>(clientInfo.lastName ?? '')
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
    if (!firstName || !lastName) {
      setNotificationType('warning')
      setNotificationTitle('Issue updating profile')
      setNotificationMessage('Please enter a valid first and last name.')
      return
    }

    if (onSave) {
      const res = await onSave(clientInfo.id, firstName, lastName, affiliation, introduction)
      if (res.error) {
        setFirstName(previousFirstName)
        setLastName(previousLastName)
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
    setPreviousFirstName(firstName)
    setPreviousLastName(lastName)
    setPreviousAffiliation(affiliation)
    setPreviousIntroduction(introduction)
    setIsEditing(false)
    setNotificationType('success')
    setNotificationTitle('Success')
    setNotificationMessage('Client updated successfully')
    onUpdatedClient?.()
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
        setFirstName(previousFirstName)
        setLastName(previousLastName)
        setAffiliation(previousAffiliation)
        setIntroduction(previousIntroduction)
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
            <EditDeleteDropdown
              containerWidth={200}
              onEdit={() => {
                setIsEditing(true)
              }}
              onDelete={() => {
                onDeleteClient?.(clientInfo.id)
                onDeletedClient?.()
              }}
            />
          )}
        </button>
        <div className="flex flex-row gap-5">
          {isEditing ? (
            <div className="space-x-2 space-y-2">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="editable-capsule"
                style={{ pointerEvents: 'initial' }}
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="editable-capsule"
                style={{ pointerEvents: 'initial' }}
              />
            </div>
          ) : (
            <h1 className="text-4xl font-normal m-0 text-dark-blue font-dm-serif-display">
              {firstName + ' ' + lastName}
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
                className="editable-capsule h-24 w-full p-2 resize-none"
                placeholder="Add introduction"
                style={{ pointerEvents: 'initial', width: '39%' }}
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
          onDelete={onDeleteProject}
          deleted={() => {
            deletedProject?.()
            setNotificationMessage('Project deleted successfully')
            setNotificationType('success')
            setNotificationTitle('Success')
            // @TODO refresh project & remove deletedProject from props
          }}
        />
      )}
    </Modal>
  )
}

export default ClientModal
