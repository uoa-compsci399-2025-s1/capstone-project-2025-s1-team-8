import React from 'react'
import Capsule from '@/components/Generic/Capsule/Capsule'
import Modal, { ModalProps } from '@/components/Generic/Modal/Modal'

interface ClientModalProps extends ModalProps{
  clientFullName: string,
  clientEmail: string,
  affiliation: string,
  introduction: string,
}

const ClientModal: React.FC<ClientModalProps> = ({ 
  open, 
  onClose, 
  className = '',
  clientFullName,
  clientEmail,
  affiliation,
  introduction,
}) => {

  return (
    <Modal open={open} onClose={onClose} className={className + " p-15 min-h-fit gap-6"}>
      <div className="flex flex-row gap-10 items-end">
        <h1 className="text-5xl m-0 text-dark-blue font-dm-serif-display">{clientFullName}</h1>
        <h2 className="text-2xl text-steel-blue font-inter">{clientEmail}</h2>
      </div>
      <div className="flex flex-row gap-5 items-center mb-6">
        <Capsule variant="muted_blue" text="Affiliation"/>
        <Capsule variant="beige" text={affiliation}/>
      </div>

      <Capsule variant="muted_blue" text="Introduction"/>
      <p className="text-dark-blue font-inter text-lg whitespace-pre-wrap">{introduction}</p>
    </Modal>
  )
}

export default ClientModal
