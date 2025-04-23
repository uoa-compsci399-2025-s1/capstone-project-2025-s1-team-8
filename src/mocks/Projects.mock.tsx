import { ProjectDTOPlaceholder } from '@/components/Generic/ProjectCard/DraggableProjectCard'

export const mockProjects1: ProjectDTOPlaceholder[] = [
  {
    projectId: 'p1',
    projectName: 'Chronobiology',
    projectDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    client: {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
    },
    additionalClients: [],
    desiredOutput: 'Functional prototype and documentation',
    teamNumber: 2,
    semesters: ['Semester 2 2025'],
    submissionDate: new Date('2025-06-30'),
  },
  {
    projectId: 'p2',
    projectName: 'Capstone Submission',
    projectDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    client: {
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
    },
    additionalClients: [],
    desiredOutput: 'Functional prototype and documentation',
    teamNumber: 2,
    semesters: ['Semester 2 2025'],
    submissionDate: new Date('2025-03-20'),
  },
]

export const mockProjects2 = [
  {
    projectTitle: 'Chronobiology',
    projectClientDetails: { name: 'David Cumin', email: 'davidcumin@gmail.com' },
    otherClientDetails: [
      { name: 'Sam Pepper', email: 'sampepper@gmail.com' },
      { name: 'Jack Salt', email: 'jacksalt@gmail.com' },
    ],
    projectDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    desiredOutput:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    desiredTeamSkills:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    availableResources:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',

    specialRequirements: false,
    numberOfTeams: 2,
    futureConsideration: true,
    Semesters: ['Semester 1 2024', 'Semester 2 2024', 'Semester 1 2025'],
    submittedDate: new Date('2023-10-01'),
  },
]
