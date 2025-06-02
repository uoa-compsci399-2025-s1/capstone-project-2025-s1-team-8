import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import ConfirmModal from './ConfirmModal'

const meta: Meta<typeof ConfirmModal> = {
  title: 'Composite/ConfirmModal',
  component: ConfirmModal,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ConfirmModal>

// A wrapper component to handle open/close logic in the story
const ModalDemo = () => {
  const [open, setOpen] = useState(true)

  const handleCancel = () => {
    console.log('Cancel clicked')
    setOpen(false)
  }

  const handleConfirm = () => {
    console.log('Confirm clicked')
    setOpen(false)
  }

  return (
    <>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => setOpen(true)}>
        Show Confirm Modal
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  )
}

export const Default: Story = {
  render: () => <ModalDemo />,
}
