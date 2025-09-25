
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '../components/ui/Textarea';
import React, { useState } from 'react';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to manage state for the interactive textarea
const InteractiveTextarea = (args: Story['args']) => {
  const [value, setValue] = useState(args?.value || '');

  return (
    <Textarea
      {...args}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
      style={{ width: '400px' }}
    />
  );
};

export const Default: Story = {
  args: {
    placeholder: 'Type here to see it grow...',
  },
  render: (args: Story['args']) => <InteractiveTextarea {...args} />,
};

export const Disabled: Story = {
  args: {
    placeholder: 'Cannot type here',
    disabled: true,
  },
  render: (args: Story['args']) => <InteractiveTextarea {...args} />,
};
