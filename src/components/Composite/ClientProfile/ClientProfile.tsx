import React from 'react'
import Capsule from '@/components/Generic/Capsule/Capsule'
import { ClientDTOPlaceholder } from '@/components/Generic/ClientCard/ClientCard'
import { FiEdit } from 'react-icons/fi'

interface ClientProfileProps {
  clientInfo: ClientDTOPlaceholder
}

const ClientProfile: React.FC<ClientProfileProps> = ({ clientInfo }) => {
  return (
    <div className="w-full h-[685px] relative bg-light-beige rounded-2xl ring-1 ring-deeper-blue p-8 pt-10 pb-14 overflow-y-auto">
      <h2 className="text-dark-blue font-inter text-xl tracking-wide pb-8">My profile</h2>
      <FiEdit className="w-4 h-4 absolute text-dark-blue hover:text-steel-blue top-11.5 right-10" />
      <div className="grid grid-cols-[max-content_auto] gap-3 pb-8">
        <Capsule text="Name" variant="muted_blue" className="ring-1 ring-muted-blue col-start-1" />
        <Capsule text={clientInfo.name} variant="beige" className="col-start-2" />

        <Capsule text="Email" variant="muted_blue" className="ring-1 ring-muted-blue col-start-1" />
        <Capsule text={clientInfo.email} variant="beige" className="col-start-2" />

        <Capsule
          text="Affiliation"
          variant="muted_blue"
          className="ring-1 ring-muted-blue col-start-1 mr-5"
        />
        {clientInfo.affiliation ? (
          <Capsule text={clientInfo.affiliation} variant="beige" className="col-start-2" />
        ) : null}
      </div>
      <div>
        <Capsule text="Introduction" variant="muted_blue" className="mb-5" />
        <p className="text-dark-blue whitespace-pre-line text-sm px-1">{clientInfo.introduction}</p>
      </div>
    </div>
  )
}

export default ClientProfile
