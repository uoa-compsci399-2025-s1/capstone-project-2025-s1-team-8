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
import { GET as GetHomePage } from '../api/globals/home/route'
import type { Home } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Welcome to Encapsulate - A place to connect Computer Science students with innovative projects',
}

export default async function HomePage() {
  const clientInfo = await ClientService.getClientInfo()
  const user: UserCombinedInfo = clientInfo.userInfo as UserCombinedInfo

  const homePage = await GetHomePage()
  const homePageCMS: Home = (await homePage.json()).data

  const aboutSection = homePageCMS.aboutSection
  const demoSection = homePageCMS.demoSection

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
            <Link href="/form">Submit your proposal</Link>
          </Button>
        </div>
      </div>

      {/* About COMPSCI399 */}
      <div className="min-h-dvh w-full bg-deeper-blue px-[8%] py-25 flex flex-col justify-center">
        <div>
          <h1 className="font-silkscreen text-light-beige text-3xl sm:text-4xl md:text-5xl font-normal pb-5">
            {aboutSection.title}
          </h1>
          <p className="text-light-beige text-sm/4 sm:text-base/5 lg:text-lg/6 pb-15">
            {aboutSection.description}
            <br />
            <br />
            {`This capstone course is designed to permit the student to exhibit problem-solving, critical thinking and communication skills, and the ability to use relevant technology; all skills developed throughout the programme. This enables them to become ‘business ready’ for their eventual engagement with companies in their future employment.`}
          </p>
          <Button variant="light" size="sm">
            <Link href={`${aboutSection.button.buttonLink}`}>{aboutSection.button.buttonName}</Link>
          </Button>
        </div>
      </div>

      {/* Encapsulate for... */}
      <div className="w-full bg-beige px-[8%] py-25 flex flex-col gap-10 lg:gap-20">
        <div className="flex flex-col lg:flex-row relative justify-between gap-10 lg:gap-20">
          <div className="w-full lg:w-[45%]">
            <h1 className="font-dm-serif-display text-deeper-blue font-normal leading-10 sm:leading-12 lg:leading-17">
              {demoSection.clientDemo.title}
            </h1>
            <p className="text-sm/4 sm:text-base/5 lg:text-lg/6 text-steel-blue">
              {demoSection.clientDemo.description}
            </p>
          </div>
          <div className="rounded-xl w-4/5 lg:w-[47%] mb-1 overflow-hidden h-min self-end lg:self-center mt-10">
            <Image
              src={FormImage}
              alt="Project proposal form"
              className="object-scale-down pointer-events-none"
            />
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
                {demoSection.studentDemo.title}
              </h1>
              <p className="text-sm/4 sm:text-base/5 lg:text-lg/6 text-steel-blue">
                {demoSection.studentDemo.description}
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
            name="Jeffery Ji"
            role="Tech Lead"
            image={JefferyPhoto}
            link="https://www.linkedin.com/in/jefferyji/"
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
        </div>
      </div>
    </div>
  )
}
