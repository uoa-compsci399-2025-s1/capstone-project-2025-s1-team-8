import React, { useState } from 'react'
import Capsule from '@/components/Generic/Capsule/Capsule'
import { FiEdit, FiSave } from 'react-icons/fi'
import { UserCombinedInfo } from '@/types/Collections'
import { handleClientProfileUpdate } from '@/lib/services/client/Handlers'

interface ClientProfileProps {
  clientInfo: UserCombinedInfo
}

const ClientProfile: React.FC<ClientProfileProps> = ({ clientInfo }) => {
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

  const handleSave = async () => {
    const names = name.split(' ')
    const firstName = names[0]
    const lastName = names[1]
    if (!firstName || !lastName) {
      setName(previousName)
      setIsEditing(false)
      alert('Please enter a valid first and last name.') //placeholder
      return
    }

    if (names.length > 2) {
      setName(previousName)
      setIsEditing(false)
      alert('Please enter only first and last name.') //placeholder
      return
    }

    const res = await handleClientProfileUpdate(firstName, lastName, affiliation, introduction)
    if (res.error) {
      setName(previousName)
      setAffiliation(previousAffiliation)
      setIntroduction(previousIntroduction)
      alert('Error updating profile: ' + res.error || res.details) //placeholder
      return
    }

    setPreviousName(name)
    setPreviousAffiliation(affiliation)
    setPreviousIntroduction(introduction)
    setIsEditing(false)
  }

  return (
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
        <Capsule text="Name" variant="muted_blue" className="ring-1 ring-muted-blue col-start-1" />
        {isEditing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="editable-capsule"
          />
        ) : (
          <Capsule text={name} variant="beige" className="col-start-2" />
        )}

        <Capsule text="Email" variant="muted_blue" className="ring-1 ring-muted-blue col-start-1" />
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
  )
}

export default ClientProfile
