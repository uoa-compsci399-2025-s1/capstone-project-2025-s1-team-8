import type { Meta, StoryObj } from '@storybook/react';
import Button from '../components/Button';

const meta: Meta<typeof Button> = {
    component: Button,
    title: 'Button',
    tags: ['autodocs'],
    args: {
      color: 'light', // default prop
    },
  };

  export default meta;
  type Story = StoryObj<typeof meta>;
  
  export const Light: Story = { args: { color: 'light' } };
  
  export const Dark: Story = { args: { color: 'dark' } };
  