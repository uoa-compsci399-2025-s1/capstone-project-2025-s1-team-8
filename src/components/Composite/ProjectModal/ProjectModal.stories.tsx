import type { Meta, StoryObj } from '@storybook/react'
import { useArgs } from '@storybook/preview-api'
import ProjectModal from './ProjectModal'
import Button from '@/components/Generic/Button/Button'
import { ProjectDetailsMock } from '@/test-config/mocks/Project.mock'
import { QueryClientDecorator } from '@/utils/storybookProvider'

const meta: Meta<typeof ProjectModal> = {
  title: 'Composite/ProjectModal',
  component: ProjectModal,
  tags: ['autodocs'],
  args: {
    open: false,
    className: '',
  },
  decorators: [QueryClientDecorator],
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
    projectInfo: ProjectDetailsMock,
    type: 'admin',
  },
}

export const Student: Story = {
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
    projectInfo: ProjectDetailsMock,
    type: 'student',
  },
}
