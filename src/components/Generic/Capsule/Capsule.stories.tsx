import type { Meta, StoryObj } from '@storybook/react'
import Capsule from './Capsule'

const meta: Meta<typeof Capsule> = {
  title: 'Generic/Capsule',
  component: Capsule,
  tags: ['autodocs'],
  args: {
    text: 'Read Me',
    variant: 'light_beige',
  },
  decorators: [
    (Story, { args }) => (
      <div
        className={`w-full h-[50px] flex items-center justify-center ${args.variant != 'light_beige' ? 'bg-light-beige' : 'bg-muted-blue'}`} // Change background color based on variant
      >
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Capsule>

export const Beige: Story = {
  args: {
    variant: 'beige',
  },
}

export const Light_Beige: Story = {
  args: {
    variant: 'light_beige',
  },
}

export const Muted_Blue: Story = {
  args: {
    variant: 'muted_blue',
  },
}

export const Deeper: Story = {
  args: {
    variant: 'deeper',
  },
}

export const Gradient: Story = {
  args: {
    variant: 'gradient',
  },
}
