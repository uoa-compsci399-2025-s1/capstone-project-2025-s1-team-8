import { TeapotCard } from '@/components/Generic/TeapotCard/TeapotCard'
import SadTeapot from 'src/assets/sad-teapot.svg'

export default function MobileAdminView() {
  return (
    <div className="lg:hidden pt-30">
      <TeapotCard title={"Please switch to a desktop device"} description=' The current device is not supported for the admin dashboard.' type="margin-10" />
    </div>
  )
}
