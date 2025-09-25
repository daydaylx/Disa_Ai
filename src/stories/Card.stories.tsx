
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: Story['args']) => (
    <Card style={{ width: '350px' }} {...args}>
      <CardHeader>
        <CardTitle>Model X</CardTitle>
        <CardDescription>Provided by OpenAI</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is a high-performance model suitable for a wide range of tasks, including complex reasoning and code generation.</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary">Details</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
    render: (args: Story['args']) => (
      <Card style={{ width: '350px' }} {...args}>
        <CardContent>
          <p>This is a simple card with just content.</p>
        </CardContent>
      </Card>
    ),
  };
