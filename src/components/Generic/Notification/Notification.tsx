'use client'

import { useEffect, type FC } from 'react'
import { memo } from 'react'
import { FiAlertCircle, FiX } from 'react-icons/fi'

interface NotificationProps {
  isVisible: boolean
  title: string
  message: string
  type?: 'success' | 'warning'
  duration?: number
  onClose?: () => void
}

const Notification: FC<NotificationProps> = memo(
  ({ isVisible = true, title, message, type = 'success', duration = 5000, onClose }) => {
    useEffect(() => {
      if (!isVisible || !onClose) return

      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }, [isVisible, onClose, duration])

    const visibleCSS = isVisible ? 'opacity-100 visible' : 'opacity-0 hidden'
    const bgRoot = {
      success: `${visibleCSS} transition-all duration-500 bg-light-green ring-2 ring-green shadow-md rounded-lg px-6 py-4 max-w-md flex flex-col`,
      warning: `${visibleCSS} transition-all duration-500 bg-light-pink ring-2 ring-pink-soft shadow-md rounded-lg px-6 py-4 max-w-md flex flex-col`,
    }

    const alertRoot = {
      success: 'text-dark-green w-5 h-5 flex-shrink-0',
      warning: 'text-pink-accent w-5 h-5 flex-shrink-0',
    }

    const alertTitle = {
      success: 'text-dark-green font-medium',
      warning: 'text-dark-pink font-medium',
    }

    const alertMessage = {
      success: 'text-dark-green text-sm',
      warning: 'text-dark-pink text-sm',
    }

    return (
      <div className={bgRoot[type]}>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-md text-pink-accent hover:text-dark-pink transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <FiAlertCircle className={alertRoot[type]} />
          <p className={alertTitle[type]}>{title}</p>
        </div>

        <p className={alertMessage[type]}>{message}</p>
      </div>
    )
  },
)

Notification.displayName = 'Notification'

export default Notification
