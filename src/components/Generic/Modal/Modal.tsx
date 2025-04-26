import React, { ReactNode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { XMarkIcon } from '@heroicons/react/16/solid'

export interface ModalProps {
  children?: ReactNode
  open: boolean // Whether the modal is open
  onClose: () => void // Function to close the modal
  className?: string // Additional classes for modal container
  // generally needs padding, height and width to be passed
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
      className={`z-100 fixed bg-[#1e6179]/59 w-full h-full flex-col items-center overflow-y-scroll left-0 top-0 py-[8%] ${open ? 'flex' : 'hidden'}`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-light-beige border-y-[9/10] max-w-full flex flex-col rounded-2xl my-auto ${className}`}
      >
        <button
          className="absolute top-10 right-10 rounded-full hover:cursor-pointer"
          onClick={onClose}
        >
          <XMarkIcon className="w-5 h-5 text-dark-blue hover:text-steel-blue" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
