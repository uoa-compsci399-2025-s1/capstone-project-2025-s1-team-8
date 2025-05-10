import { ProjectDetailsType } from '@/types/Project'
import { UserRole } from '@/types/User'

export const mockProjects: ProjectDetailsType[] = [
  {
    semesterProjectId: 'sp1',
    projectId: 'p1',
    projectTitle: 'Chronobiology',
    projectClientDetails: {
      id: '',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.Client,
      updatedAt: '',
      createdAt: '',
      email: 'johndoe@gmail.com',
    },
    otherClientDetails: [],
    projectDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    desiredOutput: 'Functional prototype and documentation',
    desiredTeamSkills:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    availableResources:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    specialRequirements: 'No',
    numberOfTeams: 'Up to 2 teams',
    futureConsideration: true,
    semesters: [
      {
        id: 'semester-2-2025',
        deadline: '02-05-2024',
        name: 'Semester 2 2025',
        startDate: '02-05-2024',
        endDate: '02-05-2024',
        updatedAt: '02-05-2024',
        createdAt: '02-05-2024',
      },
    ],
    submittedDate: new Date('2025-06-30'),
  },
  {
    semesterProjectId: 'sp3',
    projectId: 'p2',
    projectTitle: 'Capstone Submission',
    projectClientDetails: {
      id: '',
      firstName: 'Jane',
      lastName: 'Doe',
      role: UserRole.Client,
      updatedAt: '',
      createdAt: '',
      email: 'janedoe@gmail.com',
    },
    otherClientDetails: [],
    projectDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    desiredOutput: 'Functional prototype and documentation',
    desiredTeamSkills:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    availableResources:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    specialRequirements: 'No',
    numberOfTeams: 'Up to two teams',
    futureConsideration: true,
    semesters: [
      {
        id: 'semester-2-2025',
        deadline: '02-05-2024',
        name: 'Semester 2 2025',
        startDate: '02-05-2024',
        endDate: '02-05-2024',
        updatedAt: '02-05-2024',
        createdAt: '02-05-2024',
      },
    ],
    submittedDate: new Date('2025-03-20'),
  },
]
