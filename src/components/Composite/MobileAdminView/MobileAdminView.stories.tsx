import type { Meta, StoryObj } from '@storybook/react'
import MobileAdminView from './MobileAdminView'

const meta: Meta<typeof MobileAdminView> = {
  component: MobileAdminView,
  title: 'Composite/MobileAdminView',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof MobileAdminView>

export const Default: Story = {
  render: () => (
    <div>
      Shrink viewport to mobile size to see the mobile view.
      <MobileAdminView />
    </div>
  ),
}
