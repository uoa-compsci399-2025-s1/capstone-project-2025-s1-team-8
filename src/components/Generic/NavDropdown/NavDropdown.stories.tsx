import type { Meta, StoryObj } from '@storybook/react'
import NavDropdown from './NavDropdown'

const meta: Meta<typeof NavDropdown> = {
  title: 'Generic/NavDropdown',
  component: NavDropdown,
  tags: ['autodocs'],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof NavDropdown>

export const Default: Story = {
  render: function RenderNavDropdown(args) {
    return (
      <div className="bg-beige p-15">
        <NavDropdown {...args} />
      </div>
    )
  },
  args: {
    items: [
      { text: 'Item 1', href: '/item1' },
      { text: 'Item 2', href: '/item2' },
      { text: 'Item 3', href: '/item3' },
    ],
    buttonText: 'Dropdown Menu',
    dropdownOpen: false,
    setDropdownOpen: (open: boolean) => {
      console.log('Dropdown open state:', open)
    },
  },
}
