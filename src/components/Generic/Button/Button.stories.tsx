import type { Meta, StoryObj } from '@storybook/react'
import Button from './Button'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/16/solid'

const meta: Meta<typeof Button> = {
  title: 'Generic/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Click Me',
    size: 'md',
    variant: 'light',
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Light: Story = {
  args: {
    variant: 'light',
  },
}

export const Dark: Story = {
  args: {
    variant: 'dark',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
}

export const Custom: Story = {
  args: {
    variant: 'custom',
    className: 'bg-dark-blue-4 text-white px-4 py-2 rounded-md',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const WithIcons: Story = {
  args: {
    startIcon: <ArrowRightIcon className="w-5 h-5" />,
    endIcon: <ArrowLeftIcon className="w-5 h-5" />,
  },
}
