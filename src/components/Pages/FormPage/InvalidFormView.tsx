'use client'

import React from 'react'
import type { FC } from 'react'
import { HiX } from 'react-icons/hi'
import Link from 'next/link'

const InvalidFormView: FC = () => {
  return (
    <div className="h-dvh w-dvw bg-gradient-to-b from-[#779ea7] to-[#dae6e2] flex flex-col items-center overflow-y-scroll py-[8%] px-[10%] gap-4 p-4">
      <div className="relative bg-light-beige max-w-full flex flex-col rounded-2xl my-auto border border-deeper-blue">
        <div className="relative flex flex-col p-18 pt-20 rounded-t-2xl gap-6">
          <Link href="/client">
            <button className="absolute top-10 right-10 rounded-full hover:cursor-pointer">
              <HiX className="w-5 h-5 text-dark-blue hover:text-steel-blue" />
            </button>
          </Link>
          <h1 className="text-4xl font-normal m-0 text-dark-blue font-dm-serif-display mb-3">
            Computer Science Capstone: Project Proposal Form
          </h1>
          <div>
            <h2 className="text-dark-blue font-inter font-bold text-lg whitespace-pre-wrap pb-2">
              Error
            </h2>
            <p className="text-dark-blue font-inter text-sm">
              Unfortunately, you either do not have permission to access this project proposal, or
              the project proposal you are trying to access does not exist.
            </p>
            <p className="text-dark-blue font-inter text-sm">
              Please return back to the client dashboard and try again.
            </p>
          </div>
          <div>
            <h2 className="text-dark-blue font-inter font-bold text-lg whitespace-pre-wrap pb-2">
              Contacts & Information
            </h2>
            <p className="text-dark-blue font-inter text-sm">
              If you have any questions, please feel free to contact: <br />
              Anna Trofimova (
              <a className="text-steel-blue underline" href="mailto:anna.trofimova@auckland.ac.nz">
                anna.trofimova@auckland.ac.nz
              </a>
              ) <br />
              or Asma Shakil (
              <a className="text-steel-blue underline" href="mailto:asma.shakil@auckland.ac.nz">
                asma.shakil@auckland.ac.nz
              </a>
              )
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default InvalidFormView
