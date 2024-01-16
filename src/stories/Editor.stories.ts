import type { Meta, StoryObj } from '@storybook/react';
import ExampleEditor from './Editor';

const meta: Meta<typeof ExampleEditor> = {
  component: ExampleEditor,
  argTypes: { onChange: { action: 'clicked' } },
};

export default meta;
type Story = StoryObj<typeof ExampleEditor>;

export const Primary: Story = {
  args: {},
};
