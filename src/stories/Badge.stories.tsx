
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../components/ui/Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'destructive'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default Badge',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Badge',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Badge',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Badge',
  },
};
