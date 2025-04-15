import type { Meta, StoryObj } from '@storybook/react'
import Input from './InputField'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/16/solid';

const meta: Meta<typeof Input> = {
    title: 'Generic/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
      type: {
        control: 'select',
        options: ['text', 'email', 'number', 'password', 'date', 'time'],
      },
      error: { control: 'boolean' },
    },
  };
  
  export default meta;
  type Story = StoryObj<typeof Input>;
  
  export const Default: Story = {
    args: {
      placeholder: 'Enter text...',
    },
  };
  
  export const WithStartIcon: Story = {
    args: {
      placeholder: 'Search...',
      startIcon: <MagnifyingGlassIcon className="text-muted-blue w-5 h-5" />,
    },
  };
  
  export const WithEndIcon: Story = {
    args: {
      placeholder: 'Clear me',
      endIcon: <XMarkIcon className="text-muted-blue w-5 h-5 cursor-pointer" />,
    },
  };
  
  export const WithBothIcons: Story = {
    args: {
      placeholder: 'Search and clear',
      startIcon: <MagnifyingGlassIcon className="text-muted-blue w-5 h-5" />,
      endIcon: <XMarkIcon className="text-muted-blue w-5 h-5 cursor-pointer" />,
    },
  };
  
  export const ErrorState: Story = {
    args: {
      placeholder: 'Something went wrong',
      error: true,
    },
  };
  
  export const PasswordInput: Story = {
    args: {
      type: 'password',
      placeholder: 'Enter password',
    },
  };
  
  export const DateInput: Story = {
    args: {
      type: 'date',
    },
  };
