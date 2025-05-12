import type { Meta, StoryObj } from '@storybook/react'
import SemestersPage from './SemestersPage'
import { mockSemesters } from '@/mocks/newSemesters.mock'

const meta: Meta<typeof SemestersPage> = {
  title: 'Pages/SemestersPage',
  component: SemestersPage,
  tags: ['autodocs'],
  args: {
    semesters: mockSemesters,
  },
}

export default meta

type Story = StoryObj<typeof SemestersPage>

export const Default: Story = {
  render: function RenderSemestersPage(args) {
    return (
      <div className="bg-beige p-15">
        <SemestersPage {...args} />
      </div>
    )
  },
  args: {
    semesters: mockSemesters,
  },
}
