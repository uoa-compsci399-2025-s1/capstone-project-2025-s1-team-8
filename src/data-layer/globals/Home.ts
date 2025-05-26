import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'Home',
  fields: [
    {
      name: 'aboutSection',
      type: 'group',
      interfaceName: 'AboutSection',
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'About Compsci399',
          admin: {
            description: 'The title of the about section.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'COMPSCI399 Capstone is the culmination of the Computer Science degree for students at the University of Auckland. It is a compulsory course that students must undertake in order to graduate, and serves as a showcase of the knowledge and skills a student has acquired throughout their studies. Capstone courses are generally seen to have three main aims: integrating the knowledge and skills gained in the programme, reflecting on prior learning, and transitioning into the workplace. Using this as a starting point, this Computer Science capstone is seen as an opportunity to integrate the knowledge gained in the entire degree programme through problem-based learning. Students will be allocated into small teams who will then work together to solve a substantial problem. The teams will design, develop, and produce an artefact to solve the problem and present their work.\n\nThis capstone course is designed to permit the student to exhibit problem-solving, critical thinking and communication skills, and the ability to use relevant technology; all skills developed throughout the programme. This enables them to become ‘business ready’ for their eventual engagement with companies in their future employment.',
          required: true,
          admin: {
            description: 'An about us section description.',
          },
        },
        {
          name: 'button',
          type: 'group',
          interfaceName: 'Button',
          fields: [
            {
              name: 'buttonName',
              type: 'text',
              defaultValue: 'See previous projects',
              required: true,
              admin: {
                description: 'The name of the button.',
              },
            },
            {
              name: 'buttonLink',
              type: 'text',
              defaultValue: 'https://www.capitalise.space/',
              required: true,
              admin: {
                description: 'The link of the button.',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'demoSection',
      type: 'group',
      interfaceName: 'DemoSection',
      required: true,
      fields: [
        {
          name: 'clientDemo',
          type: 'group',
          interfaceName: 'ClientDemo',
          required: true,
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Encapsulate for clients',
              required: true,
              admin: {
                description: 'The title of the client demo section.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              defaultValue:
                'Hello! My name is John Doe and I am a lecturer at the University of Auckland. My hobbies include snorkelling, fishing, reading, baking, eating, sleeping and taking various methods of transport to my destination! ',
              required: true,
              admin: {
                description: 'A description of the client demo section.',
              },
            },
          ],
        },
        {
          name: 'studentDemo',
          type: 'group',
          interfaceName: 'StudentDemo',
          required: true,
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Encapsulate for students',
              required: true,
              admin: {
                description: 'The title of the student demo section.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              defaultValue:
                'Students are able to browse approved projects and their descriptions for the upcoming semester. This means that students can pre-emptively consider which projects align the best with their interests, and use this knowledge to make the most of their capstone experience.',
              required: true,
              admin: {
                description: 'A description of the student demo section.',
              },
            },
          ],
        },
      ],
    },
  ],
}
