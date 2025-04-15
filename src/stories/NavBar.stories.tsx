import type { Meta, StoryObj } from '@storybook/react';
import NavBar from '../components/NavBar'; // adjust the path if needed

const meta: Meta<typeof NavBar> = {
  component: NavBar,
  title: 'Components/NavBar',
};

export default meta;

type Story = StoryObj<typeof NavBar>;

export const Default: Story = {
  args: {},
};

export const AdditionalLink: Story = {
    args: {
      navElements: [
        { href: '/', text: 'My Dashboard' },
      ],
    },
};