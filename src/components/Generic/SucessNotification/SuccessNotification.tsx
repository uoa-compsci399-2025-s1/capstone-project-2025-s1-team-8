import { FC } from 'react'
import { FiAlertCircle } from 'react-icons/fi'

interface SuccessNotificationProps {
  isVisible: boolean
  title: string
  message: string
}

const SuccessNotification: FC<SuccessNotificationProps> = ({
  isVisible = true,
  title,
  message,
}) => {
  return (
    <div
      className={` ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all duration-500 z-50 bg-light-green ring ring-2 ring-green-soft shadow-md rounded-lg px-6 py-4 max-w-md flex flex-col`}
    >
      <div className="flex items-center gap-2">
        <FiAlertCircle className="text-green-accent w-5 h-5 flex-shrink-0" />
        <p className="text-dark-green font-medium">{title}</p>
      </div>

      <p className="text-dark-green text-sm">{message}</p>
    </div>
  )
}

export default SuccessNotification
