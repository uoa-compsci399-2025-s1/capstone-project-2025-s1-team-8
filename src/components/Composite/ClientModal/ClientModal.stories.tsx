import type { Meta, StoryObj } from '@storybook/react'
import { useArgs } from '@storybook/preview-api'
import ClientModal from './ClientModal'
import Button from '@/components/Generic/Button/Button'
import { ProjectDTOPlaceholder } from '@/components/Generic/ProjectCard/DraggableProjectCard'

const meta: Meta<typeof ClientModal> = {
  title: 'Composite/ClientModal',
  component: ClientModal,
  tags: ['autodocs'],
  args: {
    open: false,
    className: '',
  },
}

const mockProjects: ProjectDTOPlaceholder[] = [
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

export default meta
type Story = StoryObj<typeof ClientModal>

export const Exemplar: Story = {
  render: function RenderClientModal(args) {
    const [{ open }, updateArgs] = useArgs()

    function onChange() {
      updateArgs({ open: !open })
    }

    return (
      <div>
        <Button onClick={() => onChange()} variant="dark" size="md">
          Open modal
        </Button>
        <ClientModal {...args} open={open} onClose={() => onChange()}>
          <p className="text-black">This is a default modal.</p>
        </ClientModal>
      </div>
    )
  },
  args: {
    open: false,
    className: '',
    clientFullName: 'John Doe',
    clientEmail: 'johndoe@gmail.com',
    affiliation: 'University of Auckland',
    introduction:
      'Hello! My name is John Doe and I am a lecturer at the University of Auckland. \n\nMy hobbies include snorkelling, fishing, reading, baking, eating, sleeping and taking various methods of transport to my destination!\n\n"John Doe" is a common placeholder name used to represent an unknown or anonymous individual, particularly in legal or informal contexts. It\'s often used as a stand-in when a person\'s real name is not known, needs to be protected, or when a general example is needed. The female equivalent is "Jane Doe".',
    projects: mockProjects,
  },
}
