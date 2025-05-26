import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import NavBar from '@/components/Generic/NavBar/NavBar'
import Button from '@/components/Generic/Button/Button'
import Image from 'next/image'
import EncapsulateText from 'src/assets/encapsulate-text.svg'
import { handleLoginButtonClick } from '@/lib/services/user/Handlers'
import type { UserCombinedInfo } from '@/types/Collections'
import ClientService from '@/lib/services/client/ClientService'
import Teapot from '@/assets/error.svg'
import FormImage from '@/assets/form.png'
import ProjectsImage from '@/assets/project-list.png'
import EricPhoto from '@/assets/profiles/eric.jpeg'
import JooHuiPhoto from '@/assets/profiles/joohui.jpeg'
import BethanyPhoto from '@/assets/profiles/bethany.jpeg'
import DennisPhoto from '@/assets/profiles/dennis.jpeg'
import SheenaPhoto from '@/assets/profiles/sheena.jpeg'
import JefferyPhoto from '@/assets/profiles/jeffery.jpeg'
import Introduction from '@/components/Generic/PersonIntroduction/Introduction'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Welcome to Encapsulate - A place to connect Computer Science students with innovative projects',
}

export default async function HomePage() {
  const clientInfo = await ClientService.getClientInfo()
  const user: UserCombinedInfo = clientInfo.userInfo as UserCombinedInfo
  return (
    <div>
      {/* Landing */}
      <div className="h-dvh flex flex-col items-center space-y-8">
        <NavBar onclick={handleLoginButtonClick} user={user} />
        <div className="flex flex-1 flex-col justify-center items-center space-y-8 p-10">
          <EncapsulateText
            className="w-[300px] lg:w-[700px] md:w-[600px] sm:w-[500px] transition-all duration-300 ease-in-out
        mb-10 mt-9"
          />
          <Button variant="outline" size="md">
            <Link href="/auth/login">Submit your proposal</Link>
          </Button>
        </div>
      </div>

      {/* About COMPSCI399 */}
      <div className="min-h-dvh w-full bg-deeper-blue px-[8%] py-25 flex flex-col justify-center">
        <div>
          <h1 className="font-silkscreen text-light-beige text-3xl sm:text-4xl md:text-5xl font-normal pb-5">
            ABOUT COMPSCI399
          </h1>
          <p className="text-light-beige text-sm/4 sm:text-base/5 lg:text-lg/6 pb-15">
            {`COMPSCI399 Capstone is the culmination of the Computer Science degree for students at the University of Auckland. It is a compulsory course that students must undertake in order to graduate, and serves as a showcase of the knowledge and skills a student has acquired throughout their studies. Capstone courses are generally seen to have three main aims: integrating the knowledge and skills gained in the programme, reflecting on prior learning, and transitioning into the workplace. Using this as a starting point, this Computer Science capstone is seen as an opportunity to integrate the knowledge gained in the entire degree programme through problem-based learning. Students will be allocated into small teams who will then work together to solve a substantial problem. The teams will design, develop, and produce an artefact to solve the problem and present their work.`}
            <br />
            <br />
            {`This capstone course is designed to permit the student to exhibit problem-solving, critical thinking and communication skills, and the ability to use relevant technology; all skills developed throughout the programme. This enables them to become ‘business ready’ for their eventual engagement with companies in their future employment.`}
          </p>
          <Button variant="light" size="sm">
            <Link href={'https://www.capitalise.space/'}>See previous projects</Link>
          </Button>
        </div>
      </div>

      {/* Encapsulate for... */}
      <div className="w-full bg-beige px-[8%] py-25 flex flex-col gap-10 lg:gap-20">
        <div className="flex flex-col lg:flex-row relative justify-between gap-10 lg:gap-20">
          <div className="w-full lg:w-[45%]">
            <h1 className="font-dm-serif-display text-deeper-blue font-normal leading-10 sm:leading-12 lg:leading-17">
              Encapsulate
              <br />
              for clients
            </h1>
            <p className="text-sm/4 sm:text-base/5 lg:text-lg/6 text-steel-blue">
              {`Hello! My name is John Doe and I am a lecturer at the University of Auckland. My hobbies include snorkelling, fishing, reading, baking, eating, sleeping and taking various methods of transport to my destination! FIRE`}
              <br />
              <br />
              {`"John Doe" is a common placeholder name used to represent an unknown or anonymous individual, particularly in legal or informal contexts. It's often used as a stand-in when a person's real name is not known, needs to be protected, or when a general example is needed. The female equivalent is "Jane Doe". `}
            </p>
          </div>
          <div className="rounded-xl w-4/5 lg:w-[47%] mb-1 overflow-hidden h-min self-end lg:self-center mt-10">
            <Image src={FormImage} alt="Project proposal form" className="object-scale-down pointer-events-none" />
          </div>
        </div>

        <div>
          <div className="flex flex-col lg:flex-row relative gap-10 lg:gap-20 justify-between">
            <Image
              src={ProjectsImage}
              alt="Projects list"
              className="rounded-xl w-4/5 lg:w-[44%] h-auto object-scale-down pointer-events-none"
            />
            <div className="w-full lg:w-[47%] mt-3 pb-12">
              <h1 className="font-dm-serif-display text-deeper-blue font-normal leading-10 sm:leading-12 lg:leading-17">
                Encapsulate
                <br />
                for students
              </h1>
              <p className="text-sm/4 sm:text-base/5 lg:text-lg/6 text-steel-blue">
                {`Students are able to browse approved projects and their descriptions for the upcoming semester. This means that students can pre-emptively consider which projects align the best with their interests, and use this knowledge to make the most of their capstone experience.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the team */}
      <div className="bg-gradient-to-br from-[#fcdbe699] via-[#f4f1f2] to-[#dffaf1] px-[8%] py-25">
        <h1 className="font-silkscreen text-deeper-blue text-3xl sm:text-4xl md:text-5xl font-normal mb-0">
          MEET THE TEAM
        </h1>
        <div className="flex flex-col gap-5 md:flex-row md:gap-15 lg:gap-20 pb-12 items-center">
          <p className="text-steel-blue text-sm/4 sm:text-base/5 lg:text-lg/6 pb-3 pt-10">
            <i>{`Status 418 `}</i>
            {`presents to you... Encapsulate! Encapsulate was completed as a COMPSCI399 Capstone project itself, and streamlines the interactions between the School of Computer science and potential clients. A smoother, more professional process means a better experience for everyone — we’re helping to create a stronger, more dynamic capstone experience fitting for the (amazing) students coming out of it.`}
          </p>
          <div>
            <Teapot className="w-40 h-40 md:w-46 md:h-46 lg:w-53 lg:h-53" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Introduction
            name="Eric Zheng"
            role="Facilitator"
            image={EricPhoto}
            link="https://www.linkedin.com/in/eric-zheng-nz/"
          />
          <Introduction
            name="JooHui Lee"
            role="UI/UX Lead"
            image={JooHuiPhoto}
            link="https://www.linkedin.com/in/joohui-lee"
          />
          <Introduction
            name="Bethany Yates"
            role="Frontend Lead"
            image={BethanyPhoto}
            link="https://www.linkedin.com/in/bethany-yates-9907651a9/"
          />
          <Introduction
            name="Dennis Hu"
            role="Backend Lead"
            image={DennisPhoto}
            link="https://www.linkedin.com/in/dennishu811/"
          />
          <Introduction
            name="Sheena Lin"
            role="DevOps Lead"
            image={SheenaPhoto}
            link="https://www.linkedin.com/in/enshean/"
          />
          <Introduction
            name="Jeffery Ji"
            role="Documentation Lead"
            image={JefferyPhoto}
            link="https://www.linkedin.com/in/jefferyji/"
          />
        </div>
      </div>
    </div>
  )
}
