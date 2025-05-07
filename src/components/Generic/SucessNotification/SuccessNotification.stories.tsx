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
  args: {
    isVisible: true,
    title: 'Success',
    message: 'Your action was successful!',
  },
}
