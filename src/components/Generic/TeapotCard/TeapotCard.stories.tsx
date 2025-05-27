import type { Meta, StoryObj } from '@storybook/react'
import { TeapotCard } from './TeapotCard'

const meta: Meta<typeof TeapotCard> = {
  title: 'Generic/TeapotCard',
  component: TeapotCard,
  tags: ['autodocs'],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof TeapotCard>

export const Default: Story = {
  render: function RenderTeapotCard(args) {
    return (
      <div className="bg-beige p-15">
        <TeapotCard {...args} />
      </div>
    )
  },
  args: {
    title: "Projects haven't been published yet",
    description: 'Please check back at a later date!',
    center: true,
  },
}

export const Admin: Story = {
  render: function RenderTeapotCard(args) {
    return (
      <div className="bg-beige p-15">
        <TeapotCard {...args} />
      </div>
    )
  },
  args: {
    title: 'Please Switch to a Desktop Device',
    description: 'This page is not available on mobile devices.',
    center: true,
  },
}
