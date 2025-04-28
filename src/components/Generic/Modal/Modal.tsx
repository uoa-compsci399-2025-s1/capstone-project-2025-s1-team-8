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

function getHighestZIndex() {
  const elements = Array.from(document.querySelectorAll('.modal'))

  return elements.reduce((highest, el) => {
    const z = window.getComputedStyle(el).zIndex
    const zIndex = Number(z)

    return isNaN(zIndex) ? highest : Math.max(highest, zIndex)
  }, 0)
}

const Modal: React.FC<ModalProps> = ({ children, open, onClose, className = '' }) => {
  // modal component closes when clicking outside of the modal
  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const [zIndex, setZIndex] = React.useState(100)

  useEffect(() => {
    // lock page scroll, set highest z-index each time modal is opened
    if (open) {
      const highest = getHighestZIndex()
      setZIndex(highest + 10)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      // cleanup if unmounted
      setZIndex(100)
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return ReactDOM.createPortal(
    <div
      style={{ position: 'fixed', inset: 0, zIndex, display: 'flex' }}
      className={`fixed bg-[#1e6179]/59 w-full h-full flex-col items-center overflow-y-scroll py-[8%] modal`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-light-beige max-w-full flex flex-col rounded-2xl my-auto ${className}`}
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
