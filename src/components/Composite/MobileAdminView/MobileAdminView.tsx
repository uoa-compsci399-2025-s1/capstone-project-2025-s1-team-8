import type { FC } from 'react'
import SadTeapot from '@/components/Assets/SadTeapot/SadTeapot'

const MobileAdminView: FC = () => {
  return (
    <div className="lg:hidden pt-30">
      <div
        className="mx-[10%] p-5 sm:p-6 rounded-2xl w-4/5 h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] min-w-3xs overflow-y-hidden
        flex-1 flex-col flex items-center justify-center
        border border-gray-300
        bg-[linear-gradient(to_right,rgba(255,169,222,0.25),rgba(209,251,255,0.2)),linear-gradient(to_bottom,#fffef9,#d1fbff)]"
      >
        <SadTeapot className="mt-3 mb-3" />
        <div className="space-y-6 pb-10 px-6 sm:px-8">
          <p className="text-2xl sm:text-3xl md:text-4xl font-dm-serif-display text-dark-blue">
            Please switch to a desktop device
          </p>
          <p className="text-xs sm:text-sm md:text-base font-inter text-dark-blue">
            The current device is not supported for the admin dashboard.{' '}
          </p>
        </div>
      </div>
    </div>
  )
}
export default MobileAdminView
