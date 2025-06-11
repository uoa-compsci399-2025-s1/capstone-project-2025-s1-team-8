'use client'

import React, { useState } from 'react'
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

  const handleSave = async () => {
    if (!firstName || !lastName) {
      setNotificationMessage('Please enter a valid first and last name.')
      return
    }

    if (onSave) {
      const res = await onSave(firstName, lastName, affiliation, introduction)
      if (res.error) {
        setFirstName(previousFirstName)
        setLastName(previousLastName)
        setAffiliation(previousAffiliation)
        setIntroduction(previousIntroduction)
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
  }

  return (
    <div>
      <div className="fixed top-6 right-6 z-50">
        <Notification
          isVisible={notificationMessage !== ''}
          title={'Issue updating profile'}
          message={notificationMessage}
          type={'warning'}
          onClose={() => {
            setNotificationMessage('')
          }}
        />
      </div>
      <div className="w-full h-[685px] relative bg-light-beige rounded-2xl ring-1 ring-deeper-blue px-6 sm:px-8 pt-10 pb-14 overflow-y-auto">
        <h2 className="text-dark-blue font-inter text-xl tracking-wide pb-8">My profile</h2>

        {isEditing ? (
          <FiSave
            className="w-4 h-4 absolute text-dark-blue hover:text-steel-blue top-11.5 right-7 sm:right-10"
            onClick={handleSave}
          />
        ) : (
          <FiEdit
            className="w-4 h-4 absolute text-dark-blue hover:text-steel-blue top-11.5 right-7 sm:right-10"
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
            <div className="space-y-2">
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
            <Capsule
              text={firstName + ' ' + lastName}
              variant="beige"
              className="col-start-1 sm:col-start-2 mb-2 sm:mb-0"
            />
          )}

          <Capsule
            text="Email"
            variant="muted_blue"
            className="ring-1 ring-muted-blue col-start-1"
          />
          <Capsule
            text={clientInfo.email}
            variant="beige"
            className="col-start-1 sm:col-start-2 mb-2 sm:mb-0"
          />

          <Capsule
            text="Affiliation"
            variant="muted_blue"
            className="ring-1 ring-muted-blue col-start-1 mr-5"
          />
          {affiliation && !isEditing ? (
            <Capsule
              text={affiliation}
              variant="beige"
              className="col-start-1 sm:col-start-2 mb-2 sm:mb-0"
            />
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
