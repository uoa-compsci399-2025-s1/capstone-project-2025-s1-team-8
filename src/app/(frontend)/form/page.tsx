export default function Form() {
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
            <em>Note: We accept applications throughout the year, but if the deadline isn't met, we will consider the project only for the following semester.</em>
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
            Team(s) will meet with you (or your nominated representative) at least once every fortnight to ensure that the project is going in the right direction. There will be a final project presentation session (probably in the last week of the semester) that we would expect you (or your nominated representative) to attend and provide us with feedback on your team's performance.
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

      </div>
    </div>
  </div>
}
