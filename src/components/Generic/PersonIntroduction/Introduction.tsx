import type { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { StaticImageData } from 'next/image'

interface IntroductionProps {
  name: string
  role: string
  image: StaticImageData
  link: string
}

const Introduction: FC<IntroductionProps> = ({ name, role, image, link }) => {
  return (
    <div className="text-steel-blue flex flex-row gap-6 items-center">
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden">
        <Image src={image} alt={`Photo of ${name}`} className="w-full h-full object-cover" />
      </div>
      <p className="text-base sm:text-lg md:text-xl">
        <Link href={link} className="hover:text-deeper-blue">
          <b>{name} : </b>
        </Link>
        {role}
      </p>
    </div>
  )
}

export default Introduction
