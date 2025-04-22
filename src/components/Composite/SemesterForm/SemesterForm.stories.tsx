import type { Meta, StoryObj } from '@storybook/react'
import { useArgs } from '@storybook/preview-api'
import SemesterForm from './SemesterForm'
import Button from '../../Generic/Button/Button'

const meta: Meta<typeof SemesterForm> = {
  title: 'Composite/SemesterForm',
  component: SemesterForm,
  tags: ['autodocs'],
  args: {
    open: false,
    className: '',
  },
}

export default meta
type Story = StoryObj<typeof SemesterForm>

export const Empty: Story = {
  render: function RenderEmptySemesterForm(args) {
    const [{ open }, updateArgs] = useArgs()

    function onChange() {
      updateArgs({ open: !open })
    }

    return (
      <div>
        <Button onClick={() => onChange()} variant="dark" size="md">
          Open modal
        </Button>
        <SemesterForm {...args} open={open} onClose={() => onChange()}>
          <p className="text-black">This is a default modal.</p>
        </SemesterForm>
      </div>
    )
  },
  args: {
    open: false,
    className: '',
  },
}

export const WithData: Story = {
  render: function RenderSemesterFormWithData(args) {
    const [{ open }, updateArgs] = useArgs()

    function onChange() {
      updateArgs({ open: !open })
    }

    return (
      <div>
        <Button onClick={() => onChange()} variant="dark" size="md">
          Open modal
        </Button>
        <SemesterForm {...args} open={open} onClose={() => onChange()}>
          <p className="text-black">This is a default modal.</p>
        </SemesterForm>
      </div>
    )
  },
  args: {
    open: false,
    className: '',
    semesterName: 'Semester 1 2024',
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-01-31'),
    submissionDeadline: new Date('2024-01-15'),
  },
}
