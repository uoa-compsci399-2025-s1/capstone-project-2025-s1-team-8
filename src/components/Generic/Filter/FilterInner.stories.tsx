import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import FilterInner from './FilterInner'
import { EnvelopeIcon } from '@heroicons/react/16/solid' // Example icon from lucide-react or any icon lib you use

const meta: Meta<typeof FilterInner> = {
  title: 'Generic/FilterInner',
  component: FilterInner,
  tags: ['autodocs'],
  argTypes: {
    isActive: {
      control: 'boolean',
    },
    text: {
      control: 'text',
    },
    hasActiveStyles: {
      table: {
        disable: true, // This prop isn't used directly in the component
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FilterInner>

export const WithIcon: Story = {
  args: {
    text: 'Active Filter',
    icon: <EnvelopeIcon className="w-5 h-3" />,
    isActive: true,
    key: 'active-icon',
    hasActiveStyles: true,
  },
}

export const WithoutIconActive: Story = {
  args: {
    text: 'Radio Active',
    isActive: true,
    key: 'radio-active',
    hasActiveStyles: true,
  },
}

export const WithoutIconInactive: Story = {
  args: {
    text: 'Radio Inactive',
    isActive: false,
    key: 'radio-inactive',
    hasActiveStyles: true,
  },
}
