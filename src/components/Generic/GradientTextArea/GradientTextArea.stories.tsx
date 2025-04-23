import type { Meta, StoryObj } from '@storybook/react'
import GradientTextArea from './GradientTextArea'

const meta: Meta<typeof GradientTextArea> = {
  component: GradientTextArea,
  title: 'Generic/GradientTextArea',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof GradientTextArea>

export const Default: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'responsive', // or your custom one
    },
    layout: 'fullscreen', // optional but nice
  },
  args: {
    heading: 'Tips for choosing a good project name:',
    text: '• Keep it short and straight to the point!\n• The description is there for a reason!',
  },
}
