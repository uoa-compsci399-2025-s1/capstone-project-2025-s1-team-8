import type { Meta, StoryObj } from '@storybook/react'
import Notification from './Notification'

const meta: Meta<typeof Notification> = {
  title: 'Generic/Notification',
  component: Notification,
  tags: ['autodocs'],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof Notification>

export const Default: Story = {
  render: function RenderSuccessNotification(args) {
    return (
      <div className="bg-beige p-15">
        <Notification {...args} />
      </div>
    )
  },
  args: {
    isVisible: true,
    title: 'Success',
    message: 'Your action was successful!',
    type: 'success',
  },
}

export const Warning: Story = {
  render: function RenderSuccessNotification(args) {
    return (
      <div className="bg-beige p-15">
        <Notification {...args} />
      </div>
    )
  },
  args: {
    isVisible: true,
    title: 'Warning',
    message: 'Warning! Something went wrong.',
    type: 'warning',
  },
}
