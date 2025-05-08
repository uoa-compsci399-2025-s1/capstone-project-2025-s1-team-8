import type { Meta, StoryObj } from '@storybook/react'
import SuccessNotification from './SuccessNotification'

const meta: Meta<typeof SuccessNotification> = {
  title: 'Generic/SuccessNotification',
  component: SuccessNotification,
  tags: ['autodocs'],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof SuccessNotification>

export const Default: Story = {
  render: function RenderSuccessNotification(args) {
    return (
      <div className="bg-beige p-15">
        <SuccessNotification {...args} />
      </div>
    )
  },
  args: {
    isVisible: true,
    title: 'Success',
    message: 'Your action was successful!',
  },
}
