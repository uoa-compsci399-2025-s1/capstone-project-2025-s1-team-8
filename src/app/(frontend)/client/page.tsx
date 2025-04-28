'use client'

import NavBar from "@/components/Generic/NavBar/NavBar";
import CreateProjectCard from "@/components/Composite/CreateProjectCard/CreateProjectCard";
import ClientProfile from "@/components/Composite/ClientProfile/ClientProfile";
import ProjectCardList from "@/components/Composite/ProjectCardList/ProjectCardList";
import { mockClient } from "./mockClient";
import { mockProjects } from "./mockProjects";

export default function Client() {
  return (
    <div className="flex justify-center items-center">
      <div>
      <NavBar/>
      </div>
      <div className="flex flex-col items-center justify-center gap-12 mx-6 my-6 w-[80vw] pt-24">
        {/*Top component*/}
        <div className="flex flex-row place-items-stretch justify-center gap-12">
          {/*Left side*/}
          <div className="flex flex-col justify-between w-1/2">
            <CreateProjectCard/>
            <div>
              <h1>
                Tips for choosing a good project name:
              </h1>
              <ul>
                <li>
                  Keep it short and straight to the point!
                </li>
                <li>
                  The description is there for a reason!
                </li>
              </ul>
            </div>
          </div>
          {/*Right side*/}
          <div className="w-1/2">
          <ClientProfile clientInfo={mockClient}/>
          </div>
        </div>
        {/*Bottom component*/}
        <div className="flex flex-col items-center justify-center w-[80vw] gap-12">
          <ProjectCardList className="bg-muted-blue-op-45 px-15 pt-8 pb-12 rounded-2xl border-deeper-blue border" heading="My Projects"
            projects={mockProjects}/>
        </div>
      </div>
    </div>
  )
}
