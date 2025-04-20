import type { Meta, StoryObj } from '@storybook/react'
import { useArgs } from '@storybook/preview-api'
import ProjectModal from './ProjectModal'
import Button from '../../Generic/Button/Button'

const meta: Meta<typeof ProjectModal> = {
  title: 'Composite/ProjectModal',
  component: ProjectModal,
  tags: ['autodocs'],
  args: {
    open: false,
    className: '',
  },
}

export default meta
type Story = StoryObj<typeof ProjectModal>

export const Exemplar: Story = {
  render: (args) => {
    const [{ open }, updateArgs] = useArgs()

    function onChange() {
      updateArgs({ open: !open })
    }

    return (
      <div>
        <Button onClick={() => onChange()} variant="dark" size="md">
          Open modal
        </Button>
        <ProjectModal {...args} open={open} onClose={() => onChange()}>
          <p className="text-black">This is a default modal.</p>
        </ProjectModal>
      </div>
    )
  },
  args: {
    open: false,
    className: 'w-[1200px]',
    projectTitle: 'Chronobiology',
    projectClientDetails: ['David Cumin', 'davidcumin@gmail.com'],
    otherClientDetails: [
      ['Sam Pepper', 'sampepper@gmail.com'],
      ['Jack Salt', 'jacksalt@gmail.com'],
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
}
