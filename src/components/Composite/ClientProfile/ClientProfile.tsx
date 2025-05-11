import React, { useState } from 'react'
import Capsule from '@/components/Generic/Capsule/Capsule'
import { FiEdit, FiSave } from 'react-icons/fi'
import { UserCombinedInfo } from '@/types/Collections'

interface ClientProfileProps {
  clientInfo: UserCombinedInfo
}

const ClientProfile: React.FC<ClientProfileProps> = ({ clientInfo }) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    console.log('Saving data')
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
            defaultValue={`${clientInfo.firstName} ${clientInfo.lastName}`}
            className="editable-capsule"
          />
        ) : (
          <Capsule
            text={`${clientInfo.firstName} ${clientInfo.lastName}`}
            variant="beige"
            className="col-start-2"
          />
        )}

        <Capsule text="Email" variant="muted_blue" className="ring-1 ring-muted-blue col-start-1" />
        <Capsule text={clientInfo.email} variant="beige" className="col-start-2" />

        <Capsule
          text="Affiliation"
          variant="muted_blue"
          className="ring-1 ring-muted-blue col-start-1 mr-5"
        />
        {clientInfo.affiliation && !isEditing ? (
          <Capsule text={clientInfo.affiliation} variant="beige" className="col-start-2" />
        ) : (
          isEditing && (
            <input defaultValue={clientInfo.affiliation as string} className="editable-capsule" />
          )
        )}
      </div>
      <div>
        <Capsule text="Introduction" variant="muted_blue" className="mb-5" />
        {isEditing ? (
          <textarea
            defaultValue={clientInfo.introduction as string}
            className="resize-none min-h-[270px] w-full 
            text-dark-blue whitespace-pre-line text-sm border border-deeper-blue rounded-xl bg-light-beige p-3 focus:outline-deeper-blue"
          />
        ) : (
          <p className="text-dark-blue whitespace-pre-line text-sm px-1">
            {clientInfo.introduction}
          </p>
        )}
      </div>
    </div>
  )
}

export default ClientProfile
