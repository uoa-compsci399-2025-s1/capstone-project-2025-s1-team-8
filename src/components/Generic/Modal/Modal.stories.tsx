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
        <Button onClick={() => onChange()} variant="dark" size="md">
          Open modal
        </Button>

        <Modal open={open} onClose={() => onChange()} className={args.className}>
          <p className="text-black pt-10">This is a default modal.</p>
        </Modal>
      </div>
    )
  },
  args: {
    open: false,
    className: 'h-[80%] p-20',
  },
}

export const OverflowY: Story = {
  render: (args) => {
    const [{ open }, updateArgs] = useArgs()

    function onChange() {
      updateArgs({ open: !open })
    }

    return (
      <div>
        <Button onClick={() => onChange()} variant="dark" size="md">
          Open modal
        </Button>

        <Modal {...args} open={open} onClose={() => onChange()}>
          <p className="text-black pt-10">This is a default modal.</p>
        </Modal>
      </div>
    )
  },
  args: {
    open: false,
    className: 'w-[1200px] min-h-[150%] p-20',
  },
}