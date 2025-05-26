import type { Meta, StoryObj } from '@storybook/react'
import Introduction from './Introduction'

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
    image: '/profiles/eric.jpeg',
    link: 'https://www.linkedin.com/in/bethany-yates-9907651a9/',
  },
}
