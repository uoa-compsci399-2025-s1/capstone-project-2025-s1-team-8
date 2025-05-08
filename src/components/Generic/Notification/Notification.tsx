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
  const styles = {
    success: { bg: 'light-green', text: 'dark-green', ring: 'green', alert: 'dark-green' },
    warning: { bg: 'light-pink', text: 'dark-pink', ring: 'pink-soft', alert: 'pink-accent' },
  }

  return (
    <div
      className={` ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all duration-500 bg-${styles[type]['bg']} ring-2 ring-${styles[type]['ring']} shadow-md rounded-lg px-6 py-4 max-w-md flex flex-col`}
    >
      <div className="flex items-center gap-2">
        <FiAlertCircle className={`text-${styles[type]['alert']} w-5 h-5 flex-shrink-0`} />
        <p className={`text-${styles[type]['text']} font-medium`}>{title}</p>
      </div>

      <p className={`text-${styles[type]['text']} text-sm`}>{message}</p>
    </div>
  )
}

export default Notification
