import { FC } from 'react'
import Image, { StaticImageData } from 'next/image'

interface IntroductionProps {
  name: string
  role: string
  image: StaticImageData
}

const Introduction: FC<IntroductionProps> = ({ name, role, image }) => {
  return (
    <div className="text-xl text-steel-blue flex flex-row gap-6 items-center">
      <div className="w-16 h-16 rounded-full overflow-hidden">
        <Image src={image} alt={`Photo of ${name}`} className="w-full h-full object-cover" />
      </div>
      <p>
        <b>{name} : </b>
        {role}
      </p>
    </div>
  )
}

export default Introduction
