import React, { useEffect, useState } from 'react'
import Capsule from '@/components/Generic/Capsule/Capsule'
import { FiEdit, FiSave } from 'react-icons/fi'
import type { UserCombinedInfo } from '@/types/Collections'
import type { StatusCodes } from 'http-status-codes'
import Notification from '@/components/Generic/Notification/Notification'

interface ClientProfileProps {
  clientInfo: UserCombinedInfo
  onSave?: (
    firstName: string,
    lastName: string,
    affiliation: string,
    introduction: string,
  ) => Promise<{
    updatedUser: UserCombinedInfo
    status: StatusCodes
    error?: string
    details?: string
  }>
}

const ClientProfile: React.FC<ClientProfileProps> = ({ clientInfo, onSave }) => {
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
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [notificationMessage, setNotificationMessage] = useState<string>('')

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showNotification])

  const handleShowNotification = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
  }

  const handleSave = async () => {
    const names = name.split(' ')
    const firstName = names[0]
    const lastName = names[1]
    if (!firstName || !lastName) {
      setName(previousName)
      setIsEditing(false)
      handleShowNotification('Please enter a valid first and last name.')
      return
    }

    if (names.length > 2) {
      setName(previousName)
      setIsEditing(false)
      handleShowNotification('Please enter only first and last name.')
      return
    }
    if (onSave) {
      const res = await onSave(firstName, lastName, affiliation, introduction)
      if (res.error) {
        setName(previousName)
        setAffiliation(previousAffiliation)
        setIntroduction(previousIntroduction)
        handleShowNotification(
          'Error updating profile: ' + ((res.error ?? '') || (res.details ?? '')),
        )
        return
      }
    }

    setPreviousName(name)
    setPreviousAffiliation(affiliation)
    setPreviousIntroduction(introduction)
    setIsEditing(false)
  }

  return (
    <div>
      <div className="fixed top-6 right-6 z-50">
        <Notification
          isVisible={showNotification}
          title={'Issue updating profile'}
          message={notificationMessage}
          type={'warning'}
        />
      </div>
      <div className="w-full h-[685px] relative bg-light-beige rounded-2xl ring-1 ring-deeper-blue p-8 pt-10 pb-14 overflow-y-auto">
        <h2 className="text-dark-blue font-inter text-xl tracking-wide pb-8">My profile</h2>

        {isEditing ? (
          <FiSave
            className="w-4 h-4 absolute text-dark-blue hover:text-steel-blue top-11.5 right-10"
            onClick={handleSave}
          />
        ) : (
          <FiEdit
            className="w-4 h-4 absolute text-dark-blue hover:text-steel-blue top-11.5 right-10"
            onClick={() => setIsEditing(true)}
          />
        )}

        <div className="grid grid-cols-[max-content_auto] gap-3 pb-8">
          <Capsule
            text="Name"
            variant="muted_blue"
            className="ring-1 ring-muted-blue col-start-1"
          />
          {isEditing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="editable-capsule"
            />
          ) : (
            <Capsule text={name} variant="beige" className="col-start-2" />
          )}

          <Capsule
            text="Email"
            variant="muted_blue"
            className="ring-1 ring-muted-blue col-start-1"
          />
          <Capsule text={clientInfo.email} variant="beige" className="col-start-2" />

          <Capsule
            text="Affiliation"
            variant="muted_blue"
            className="ring-1 ring-muted-blue col-start-1 mr-5"
          />
          {affiliation && !isEditing ? (
            <Capsule text={affiliation} variant="beige" className="col-start-2" />
          ) : (
            isEditing && (
              <input
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                className="editable-capsule"
              />
            )
          )}
        </div>
        <div>
          <Capsule text="Introduction" variant="muted_blue" className="mb-5" />
          {isEditing ? (
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              className="resize-none min-h-[270px] w-full 
            text-dark-blue whitespace-pre-line text-sm border border-deeper-blue rounded-xl bg-light-beige p-3 focus:outline-deeper-blue"
            />
          ) : (
            <p className="text-dark-blue whitespace-pre-line text-sm px-1">{introduction}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientProfile
