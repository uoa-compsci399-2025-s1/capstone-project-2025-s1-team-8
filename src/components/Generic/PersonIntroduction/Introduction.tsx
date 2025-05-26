import type { FC } from 'react'
import Link from 'next/link'

interface IntroductionProps {
  name: string
  role: string
  image: string
  link: string
}

const Introduction: FC<IntroductionProps> = ({ name, role, image, link }) => {
  return (
    <div className="text-steel-blue flex flex-row gap-6 items-center">
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden">
        <img
          src={image}
          alt={`Photo of ${name}`}
          className="w-full h-full object-cover pointer-events-none"
        />
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
