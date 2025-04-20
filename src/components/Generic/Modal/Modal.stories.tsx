import type { Meta, StoryObj } from '@storybook/react'
import { useArgs } from '@storybook/preview-api'
import Modal from './Modal'
import Button from '../Button/Button'

const meta: Meta<typeof Modal> = {
  title: 'Generic/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    open: false,
    className: '',
  },
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: (args) => {
    const [{ open }, updateArgs] = useArgs()

    function onChange() {
      updateArgs({ open: !open })
    }

    return (
      <div>
        <button onClick={() => onChange()}>
          <Button variant="dark" children="Open modal" size="md" />
        </button>

        <Modal {...args} open={open} onClose={() => onChange()}>
          <p className="text-black pt-10">This is a default modal.</p>
        </Modal>
      </div>
    )
  },
  args: {
    open: false,
    className: 'h-[500px]',
  },
}
