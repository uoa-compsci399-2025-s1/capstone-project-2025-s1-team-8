import type { Meta, StoryObj } from '@storybook/react'
import { useArgs } from '@storybook/preview-api'
import ProjectModal from './ProjectModal'
import Button from '@/components/Generic/Button/Button'
import { mockProjects2 } from '@/mocks/Projects.mock'

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
  render: function RenderProjectModal(args) {
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
    className: '',
    ...mockProjects2[0],
  },
}
