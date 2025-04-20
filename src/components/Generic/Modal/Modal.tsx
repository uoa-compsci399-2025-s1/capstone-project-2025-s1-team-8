import React, { ReactNode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Button from '../Button/Button'
import { XMarkIcon } from '@heroicons/react/16/solid'

export interface ModalProps {
  children: ReactNode
  open: boolean // Whether the modal is open
  onClose: () => void // Function to close the modal
  className?: string // Additional classes for modal container
}

const Modal: React.FC<ModalProps> = ({ children, open, onClose, className = '' }) => {
  // modal component closes when clicking outside of the modal
  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  useEffect(() => {
      // lock page scroll
      document.body.style.overflow = open ? 'hidden' : ''
      return () => {
        // cleanup if unmounted
        document.body.style.overflow = ''
      }
    }, [open]) 

  return ReactDOM.createPortal(
    <div
      className={`fixed bg-[#1e6179]/59 w-full h-full flex-col items-center overflow-y-scroll left-0 top-0 ${open ? 'flex' : 'hidden'}`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-light-beige max-w-full w-[1280px] flex flex-col items-center rounded-[20px] p-8 ${className}`}
      >
        <div className={``}>
          <Button className="absolute top-4 right-4 rounded-full" onClick={onClose}>
            <XMarkIcon className="text-dark-blue w-5 h-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
