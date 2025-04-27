import type { Meta, StoryObj } from '@storybook/react'
import Homepage from './Homepage'

const meta: Meta<typeof Homepage> = {
  title: 'Pages/Homepage',
  component: Homepage,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Homepage>

export const Default: Story = {
  render: function RenderHomepage() {
    return (
      <div className="bg-beige p-15">
        <Homepage />
      </div>
    )
  },
}
