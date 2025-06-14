import type { GlobalConfig } from 'payload'

export const Form: GlobalConfig = {
  slug: 'form',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Computer Science Capstone: Project Proposal Form',
      admin: {
        description: 'The name of this form',
      },
    },
    {
      name: 'descriptionSection',
      type: 'group',
      interfaceName: 'DescriptionSection',
      required: true,
      admin: {
        description: 'The form description',
      },
      fields: [
        {
          name: 'projectRequirements',
          type: 'group',
          required: true,
          admin: {
            description: 'The title of the student demo section.',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              defaultValue: 'Project Requirements',
              admin: {
                description: 'The title of the project requirements section.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              defaultValue:
                'The proposed project should be a research or software development project, suitable in size to be completed within the 12-week duration of the semester. It should present a challenge for a team consisting of 5-6 students. For example, if you are involved in an ongoing research/development project and seek assistance in developing a specific module, you can propose it as a potential project. Alternatively, if you are in a service role and require support in creating a system to facilitate or automate certain aspects of your work, you can suggest a project for consideration.\n\nEach team is expected to allocate approximately 7-8 hours per person per week to project development. The team will produce a prototype system every fortnight, progressively enhancing its functionality.',
              admin: {
                description: 'The description of the project requirements.',
              },
            },
          ],
        },
        {
          name: 'supervisionRequirements',
          type: 'group',
          required: true,
          admin: {
            description: 'The description of the supervision requirements.',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              defaultValue: 'Supervision Requirements',
              admin: {
                description: 'The title of the supervision requirements section.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              defaultValue:
                "Team(s) will meet with you (or your nominated representative) at least once every fortnight to ensure that the project is going in the right direction. There will be a final project presentation session (probably in the last week of the semester) that we would expect you (or your nominated representative) to attend and provide us with feedback on your team's performance.",
              admin: {
                description: 'The description of the supervision requirements.',
              },
            },
          ],
        },
        {
          name: 'disclaimerAndLimitations',
          type: 'group',
          required: true,
          admin: {
            description: 'The description of the disclaimer and limitations.',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              defaultValue: 'Disclaimer & Limitations',
              admin: {
                description: 'The title of the disclaimer and limitations.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              defaultValue:
                'Please note that the COMPSCI 399 Capstone Course is designed solely as an academic experience for the duration of the semester. The course does not allocate any resources for ongoing support or maintenance of project outcomes beyond the end of the semester. Any further support, maintenance, or development required post-semester must be arranged independently by the proposing party. Consequently, neither the university nor the participating students assume any liability for any issues, operational continuity, or further development of the project after the course concludes.',
              admin: {
                description: 'The limitations of the project.',
              },
            },
          ],
        },
      ],
    },
  ],
}
