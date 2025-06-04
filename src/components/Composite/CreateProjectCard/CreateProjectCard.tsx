'use client'

import React from 'react'
import Input from '@/components/Generic/Input/InputField'
import Button from '@/components/Generic/Button/Button'
import { useState } from 'react'
import Link from 'next/link'

const CreateProjectCard = () => {
  const [projectName, setProjectName] = useState('')

  return (
    <div className="w-full bg-light-beige rounded-2xl ring-1 ring-deeper-blue p-8 pt-10 pb-14">
      <h2 className="text-dark-blue font-inter text-xl tracking-wide pb-6">Create new project</h2>
      <p className="text-dark-blue font-medium text-sm pb-4">Project Name</p>
      <div className="flex flex-row justify-start gap-3">
        <div className="flex-grow">
          <Input
            placeholder="Enter name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <Link href={projectName === '' ? '/form' : `/form?projectName=${projectName}`}>
          <Button
            variant="custom"
            size="custom"
            className="bg-deeper-blue text-light-beige ring-1 ring-steel-blue hover:bg-steel-blue rounded-xl px-4 py-2 text-sm"
          >
            Next
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default CreateProjectCard
