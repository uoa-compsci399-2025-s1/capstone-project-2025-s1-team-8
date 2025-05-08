import { FC } from 'react'
import { FiAlertCircle } from 'react-icons/fi'

interface NotificationProps {
  isVisible: boolean
  title: string
  message: string
  type?: 'success' | 'warning'
}

const Notification: FC<NotificationProps> = ({
  isVisible = true,
  title,
  message,
  type = 'success',
}) => {
  const bgRoot = {
    success: `${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all duration-500 bg-light-green ring-2 ring-green shadow-md rounded-lg px-6 py-4 max-w-md flex flex-col`,
    warning: `${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all duration-500 bg-light-pink ring-2 ring-pink-soft shadow-md rounded-lg px-6 py-4 max-w-md flex flex-col`,
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
      <div className="flex items-center gap-2">
        <FiAlertCircle className={alertRoot[type]} />
        <p className={alertTitle[type]}>{title}</p>
      </div>

      <p className={alertMessage[type]}>{message}</p>
    </div>
  )
}

export default Notification
