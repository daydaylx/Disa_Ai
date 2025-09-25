
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '../components/ui/Switch';
import { useState } from 'react';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// A helper component to manage the state of the switch
const InteractiveSwitch = (args: Story['args']) => {
  const [isChecked, setIsChecked] = useState(args?.checked || false);

  return (
    <Switch
      {...args}
      checked={isChecked}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsChecked(e.target.checked)}
    />
  );
};

export const Default: Story = {
  render: (args: Story['args']) => <InteractiveSwitch {...args} />,
};

export const DefaultOn: Story = {
    args: {
        checked: true,
    },
    render: (args: Story['args']) => <InteractiveSwitch {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args: Story['args']) => <InteractiveSwitch {...args} />,
};
