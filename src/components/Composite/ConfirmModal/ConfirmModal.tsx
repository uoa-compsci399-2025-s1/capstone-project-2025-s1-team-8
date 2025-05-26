import React from 'react'
import type { ModalProps } from '@/components/Generic/Modal/Modal'
import Modal from '@/components/Generic/Modal/Modal'
import Button from '@/components/Generic/Button/Button'
import { FiX } from 'react-icons/fi'

interface ConfirmModalProps extends ModalProps {
  title?: string
  message?: string
  onCancel: () => void
  onConfirm: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  className = '',
  title = 'Are you sure you want to delete this?',
  message = 'This item will be deleted immediately. You cannot undo this action.',
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal open={open} onClose={onClose} className={className + ' min-h-fit w-[50%] top-5'}>
      <div className="relative max-w-full bg-frost-blue ring-1 ring-deeper-blue p-9 rounded-xl flex flex-col gap-2">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-black hover:text-dark-blue transition-colors text-lg cursor-pointer"
          aria-label="Close notification"
        >
          <FiX className="w-5 h-5" />
        </button>
        <p className={`text-dark-blue font-semibold text-lg`}>{title}</p>
        <p className={`text-dark-blue leading-snug text-lg`}>{message}</p>
        <div className={`flex gap-3 pt-2 justify-end pr-2`}>
        <Button
            variant="custom"
            size="sm"
            className="bg-muted-blue ring-1 ring-deeper-blue hover:bg-transparent-blue text-dark-blue font-medium"
            onClick={onConfirm}
          >
            Delete
          </Button>
          <Button variant="dark" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
