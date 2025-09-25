
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Composer } from '../components/Composer';
import React, { useState } from 'react';

const meta: Meta<typeof Composer> = {
  title: 'App/Composer',
  component: Composer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    streaming: { control: 'boolean' },
    canSend: { control: 'boolean' },
    onSend: { action: 'onSend' },
    onStop: { action: 'onStop' },
    onChange: { action: 'onChange' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to manage state for the interactive composer
const InteractiveComposer = (args: Story['args']) => {
  const [value, setValue] = useState(args?.value || '');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    // @ts-ignore
    args.onChange(newValue);
  };

  return <Composer {...args} value={value} onChange={handleChange} />;
};

export const Default: Story = {
  args: {
    streaming: false,
    canSend: true,
  },
  render: (args: Story['args']) => <InteractiveComposer {...args} />,
};

export const WithText: Story = {
    args: {
      ...Default.args,
      value: 'This is a message waiting to be sent.',
    },
    render: (args: Story['args']) => <InteractiveComposer {...args} />,
  };

export const Streaming: Story = {
  args: {
    ...Default.args,
    value: 'This was the prompt.',
    streaming: true,
  },
  render: (args: Story['args']) => <InteractiveComposer {...args} />,
};

export const Disabled: Story = {
    args: {
      ...Default.args,
      value: 'Cannot send this message.',
      canSend: false,
    },
    render: (args: Story['args']) => <InteractiveComposer {...args} />,
  };
