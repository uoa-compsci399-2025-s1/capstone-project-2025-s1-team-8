import type { Meta, StoryObj } from '@storybook/react'
import Introduction from './Introduction'
import EricPhoto from '@/assets/profiles/eric.jpg'

const meta: Meta<typeof Introduction> = {
  title: 'Generic/Introduction',
  component: Introduction,
  tags: ['autodocs'],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof Introduction>

export const Default: Story = {
  render: function RenderIntroduction(args) {
    return (
      <div className="bg-beige p-15">
        <Introduction {...args} />
      </div>
    )
  },
  args: {
    name: 'Eric Zheng',
    role: 'Facilitator',
    image: EricPhoto
  },
}
