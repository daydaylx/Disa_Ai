
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageBubble } from '../components/ui/MessageBubble';
import CodeBlock from '../components/CodeBlock';

const meta: Meta<typeof MessageBubble> = {
  title: 'UI/MessageBubble',
  component: MessageBubble,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['user', 'ai'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
  args: {
    variant: 'user',
    children: <p>Hello! This is a message from the user.</p>,
  },
};

export const AIMessage: Story = {
  args: {
    variant: 'ai',
    children: <p>Hello! This is a response from the AI.</p>,
  },
};

export const AILongMessage: Story = {
    args: {
      variant: 'ai',
      children: <p>This is a longer response from the artificial intelligence to demonstrate how the text wraps within the message bubble. The maximum width is constrained to ensure readability on mobile devices.</p>,
    },
  };

export const AIMessageWithCode: Story = {
  args: {
    variant: 'ai',
    children: (
      <div className="space-y-4">
        <p>Sure, here is a simple React component for you:</p>
        <CodeBlock
          lang="jsx"
          code={`import * as React from "react";\n\nconst MyComponent = () => (\n  <div>Hello, World!</div>\n);\n\nexport default MyComponent;`}
        />
        <p>Let me know if you have any other questions.</p>
      </div>
    ),
  },
};
