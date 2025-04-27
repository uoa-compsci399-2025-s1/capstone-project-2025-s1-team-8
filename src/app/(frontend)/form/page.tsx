"use client"
import React, { useState } from "react";
import Button from "@/components/Generic/Button/Button";
import Input from "@/components/Generic/Input/InputField";
import Textarea from "@/components/Generic/Textarea/Textarea";
import Radio from "@/components/Generic/Radio/Radio";
import Checkbox from "@/components/Generic/Checkbox/Checkbox";
import { semesterNames1 } from "@/mocks/Semesters.mock";

interface Pair {
  fullName: string;
  email: string;
}

export default function Form() {
  const [pairs, setPairs] = useState<Pair[]>([
  ]);

  const handleChange = (
    index: number,
    field: keyof Pair,
    value: string
  ) => {
    const updated = [...pairs];
    updated[index][field] = value;
    setPairs(updated);
  };

  const addPair = () => {
    setPairs([...pairs, { fullName: '', email: '' }]);
  };

  const deletePair = (index: number) => {
    setPairs(pairs.filter((_, i) => i !== index));
  };

  return <div
    className="h-dvh w-dvw bg-gradient-to-b from-deep-teal to-muted-blue flex flex-col items-center overflow-y-scroll py-[8%] gap-4 p-4"
  >
    <div
      className="relative bg-light-beige w-[1280px] max-w-full flex flex-col rounded-2xl my-auto"
    >
      <div
        className="relative flex flex-col p-15 rounded-t-2xl gap-6"
      >
        <h1 className="text-4xl font-normal m-0 text-dark-blue font-dm-serif-display mb-3">
          Computer Science Capstone: Project Proposal Form
        </h1>
        <div>
          <h2 className="text-dark-blue font-inter font-bold text-lg whitespace-pre-wrap">
            Deadline
          </h2>
          <p className="text-dark-blue font-inter text-sm">
            Please complete this form if you wish to propose a project for the COMPSCI 399 Capstone Course in <b>S1 2025</b>. The deadline for form submission is <b>July 11, 2025, by 11:59 pm</b>.
            <br />
            <br />
            <em>Note: We accept applications throughout the year, but if the deadline isn&apos;t met, we will consider the project only for the following semester.</em>
          </p>
        </div>
        <div>
          <h2 className="text-dark-blue font-inter font-bold text-lg whitespace-pre-wrap">
            Project Requirements
          </h2>
          <p className="text-dark-blue font-inter text-sm">
            The proposed project should be a research or software development project, suitable in size to be completed within the 12-week duration of the semester. It should present a challenge for a team consisting of 5-6 students. For example, if you are involved in an ongoing research/development project and seek assistance in developing a specific module, you can propose it as a potential project. Alternatively, if you are in a service role and require support in creating a system to facilitate or automate certain aspects of your work, you can suggest a project for consideration.
            <br />
            <br />
            Each team is expected to allocate approximately 7-8 hours per person per week to project development. The team will produce a prototype system every fortnight, progressively enhancing its functionality.
          </p>
        </div>
        <div>
          <h2 className="text-dark-blue font-inter font-bold text-lg whitespace-pre-wrap">
            Supervision Requirements
          </h2>
          <p className="text-dark-blue font-inter text-sm">
            Team(s) will meet with you (or your nominated representative) at least once every fortnight to ensure that the project is going in the right direction. There will be a final project presentation session (probably in the last week of the semester) that we would expect you (or your nominated representative) to attend and provide us with feedback on your team&apos;s performance.
          </p>
        </div>
        <div>
          <h2 className="text-dark-blue font-inter font-bold text-lg whitespace-pre-wrap">
            Disclaimer & Limitations
          </h2>
          <p className="text-dark-blue font-inter text-sm">
            Please note that the COMPSCI 399 Capstone Course is designed solely as an academic experience for the duration of the semester. The course does not allocate any resources for ongoing support or maintenance of project outcomes beyond the end of the semester. Any further support, maintenance, or development required post-semester must be arranged independently by the proposing party. Consequently, neither the university nor the participating students assume any liability for any issues, operational continuity, or further development of the project after the course concludes.
          </p>
        </div>
        <div>
          <h2 className="text-dark-blue font-inter font-bold text-lg whitespace-pre-wrap">
            Contacts & Information
          </h2>
          <p className="text-dark-blue font-inter text-sm">
            You can find examples of projects created by capstone students following this link: <a className="text-steel-blue underline" href="https://www.capitalise.space" target="_blank">https://www.capitalise.space/</a> <br />
            The course overview can be found here: <a className="text-steel-blue underline" href="https://courseoutline.auckland.ac.nz/dco/course/COMPSCI/399/1243">https://courseoutline.auckland.ac.nz/dco/course/COMPSCI/399/1243</a> <br/>
            <br />
            If you have any questions, please feel free to contact: <br />
            Anna Trofimova (<a className="text-steel-blue underline" href="mailto:anna.trofimova@auckland.ac.nz">anna.trofimova@auckland.ac.nz</a>) <br />
            or Asma Shakil (<a className="text-steel-blue underline" href="mailto:asma.shakil@auckland.ac.nz">asma.shakil@auckland.ac.nz</a>)
          </p>
        </div>
      </div>
      <div
        className="relative bg-transparent-blue border-t-deeper-blue border-t max-w-full flex flex-col p-15 rounded-b-2xl gap-5"
      >
        <p className="text-dark-blue font-inter">
          <span className="text-pink-2">*</span> Required
        </p>
        <form className="flex flex-col gap-4">
          <ol className="flex flex-col gap-10 list-decimal list-outside text-dark-blue font-inter text-lg whitespace-pre-wrap ml-5" type="1">
            <li>
              <label htmlFor="ClientName">
                Main client&apos;s (applicant&apos;s) name <span className="text-pink-2">*</span>
              </label>              
              <p className="form-question-subheading">
                Please provide your name. 
              </p>
              <Input
                id="ClientName"
                name="ClientName"
                type="text"
                placeholder="Enter the main client&apos;s name"
                required={true}
              />
            </li>
            <li>
              <label htmlFor="ClientEmail">
                Main client&apos;s (applicant&apos;s) email <span className="text-pink-2">*</span>
              </label>              
              <p className="form-question-subheading">
                Please provide your email. 
              </p>
              <Input
                id="ClientEmail"
                name="ClientEmail"
                type="text"
                placeholder="Enter the main client&apos;s email"
              />
            </li>
            <li>
              <div className="flex justify-between items-center">
                <div>
                  <label className="" htmlFor="OtherClientDetails">
                    Other client&apos;s details 
                  </label>              
                  <p className="form-question-subheading">
                    If there is anyone else involved in the project, please provide their names and emails.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="muted_blue" 
                  size="md"
                  className="self-start"
                  onClick={addPair}
                >
                  + Add Client
                </Button>
              </div>
              {pairs.map((pair, idx) => (
                <div key={idx} className="flex gap-5 justify-end mb-5">
                  <div className="w-80">
                    <label className="text-sm">
                      Full Name:
                    </label>
                    <Input
                      id={`OtherClientName${idx}`}
                      type="text"
                      onChange={e => handleChange(idx, 'fullName', e.target.value)}
                      placeholder="Other client&apos;s name"
                    />
                  </div>
                  <div className="w-full">
                    <label className="text-sm">
                      Email:
                    </label>
                    <Input
                      id={`OtherClientEmail${idx}`}
                      type="email"
                      onChange={e => handleChange(idx, 'email', e.target.value)}
                      placeholder="Other client&apos;s email"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="dark" 
                    size="md"
                    className="ml-10 self-end h-10"
                    onClick={() => deletePair(idx)}
                  >
                    Delete
                  </Button>
                </div>
              ))}

            </li>
            <li>
              <label htmlFor="ProjectTitle">
                Project title <span className="text-pink-2">*</span>
              </label>              
              <p className="form-question-subheading">
                Please provide an informative project title.
              </p>
              <Input
                id="ProjectTitle"
                name="ProjectTitle"
                type="text"
                placeholder="Enter the main client&apos;s email"
              />
            </li>
            <li>
              <label htmlFor="ProjectDescription">
                Project Description <span className="text-pink-2">*</span>
              </label>              
              <p className="form-question-subheading">
                Please provide a short description (3-10 sentences) of the project.
              </p>
              <Textarea
                id="ProjectDescription"
                name="ProjectDescription"
                placeholder="Enter the main client&apos;s email"
                className="h-25"
              />
            </li>
            <li>
              <label htmlFor="DesiredOutput">
                Desired Output <span className="text-pink-2">*</span>
              </label>              
              <p className="form-question-subheading">
                Please identify the features that will constitute the MVP (minimum viable product).
              </p>
              <Textarea
                id="DesiredOutput"
                name="DesiredOutput"
                placeholder="Enter the desired output"
                className="h-25"
              />
            </li>
            <li>
              <label htmlFor="SpecialEquipmentRequirements">
                Special equipment requirements <span className="text-pink-2">*</span>
              </label>              
              <p className="form-question-subheading">
                Will your project require special equipment that you are unable to provide? If yes, please specify the required equipment. Note: We can only accept a limited number of projects with special equipment needs.
              </p>
              <Radio
                name="SpecialEquipmentRequirements"
                values={['Yes']}
                customInput={true}
              />
            </li>
            <li>
              <label htmlFor="SpecialEquipmentRequirements">
                Number of teams <span className="text-pink-2">*</span>
              </label>              
              <p className="form-question-subheading">
                Would you be open to the idea of <b>multiple teams working on your project</b>?  If yes, please specify the maximum number of teams you would be happy to work with. To make it easier for you, all team meetings will be combined into the same time slot, ensuring you won&apos;t need to allocate more meeting time than you would with one team.
                <br />
                <br />
                For your consideration, 1-4 teams would require a 1-hour meeting fortnightly. Additionally, we will invite you to evaluate teams&apos; final presentations, typically taking about 20 minutes per team.Working with multiple teams offers the advantage of bringing diverse perspectives and ideas to the project. 
                <br />
                <br />
                It also increases the likelihood of achieving a final result that aligns with expectations.
              </p>
              <Radio
                name="NumberOfTeams"
                values={['No, only 1 team', 'Yes, up to 4 teams']}
                customInput={true}
              />
            </li>
            <li>
              <label htmlFor="DesiredTeamSkills">
                Desired team skills
              </label>              
              <p className="form-question-subheading">
                Please specify any skills you would like team members to have. This could include expertise in a specific technology or tool that you want the team to use for implementing the project.
              </p>
              <Textarea
                id="DesiredTeamSkills"
                name="DesiredTeamSkills"
                placeholder="Enter any desired team skills"
                className="h-25"
              />
            </li>
            <li>
              <label htmlFor="AvailableResources">
                Available Resources
              </label>              
              <p className="form-question-subheading">
                Are there any resources you would like to provide for students to become more familiar with your project?
              </p>
              <Textarea
                id="AvailableResources"
                name="AvailableResources"
                placeholder="Enter any available resources"
                className="h-25"
              />
            </li>
            <li>
              <label htmlFor="FutureConsideration">
                Future consideration<span className="text-pink-2">*</span>
              </label>              
              <p className="form-question-subheading">
                If your project is not selected by students in the upcoming semester, would you like it to be considered for following semesters?
              </p>
              <Radio
                name="FutureConsideration"
                values={['Yes', 'No']}
                required={true}
              />
            </li>
            <li>
              <label htmlFor="FutureSemesters">
                Future Semesters
              </label>              
              <p className="form-question-subheading">
                If you replied yes to the question above, what semesters would you like your project to be considered for? 
              </p>
              <Checkbox
                name="FutureSemesters"
                values={semesterNames1}
              />
            </li>
            <li>
              <label htmlFor="MeetingAttendance">
                Meeting attendance <span className="text-pink-2">*</span>
              </label>              
              <p className="form-question-subheading">
                The teaching team will aim to arrange meetings with the students at times that best suit your schedule. You can attend the meetings either in person or via Zoom (or Teams). The details and schedule of the meetings will be arranged at the beginning of the semester and will cover the entire duration of the course.
              </p>
              <Checkbox
                name = "MeetingAttendance"
                values={['I confirm that I will be able to attend <b>6 meetings</b> with students, scheduled 2-3 weeks apart.']}
                required={true}
              />
            </li>
            <li>
              <label htmlFor="FinalPresentationAttendance">
                Final presentation attendance <span className="text-pink-2">*</span>
              </label>              
              <p className="form-question-subheading">
                The teaching team will aim to arrange the final presentation at a time that best suits your schedule. The final presentation will be held on the UoA Main Campus and must be attended in person.
              </p>
              <Checkbox
                name = "FinalPresentationAttendance"
                values={['I confirm that I will be able to attend final presentation in-person.']}
                required={true}
              />
            </li>
            <li>
              <label htmlFor="ProjectSupportAndMaintenance">
                Project Support and Maintenance <span className="text-pink-2">*</span>
              </label>              
              <p className="form-question-subheading">
                The COMPSCI 399 Capstone Course is provided solely for academic purposes during the semester.
              </p>
              <Checkbox
                name="ProjectSupportAndMaintenance"
                values={['I understand that no resources will be available for support or maintenance after the semester ends, and that neither the University nor the participating students assume any liability for the project outcome.']}
                required={true}
              />
            </li>
          </ol>
          <Button
            type="submit"
            variant="dark"
            size="md"
            className="self-start mt-5"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  </div>
}
