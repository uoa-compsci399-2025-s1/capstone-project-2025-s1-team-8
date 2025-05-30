import type { Meta, StoryObj } from '@storybook/react'
import Radio from './Radio'

const meta: Meta<typeof Radio> = {
  title: 'Generic/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof Radio>

// export const Default: Story = {
//   args: {
//     values: ['Option 1', 'Option 2', 'Option 3'],
//     customInput: true,
//   },
// }


export const Default: Story = {
  render: function RenderModal(args) {

    return (
      <form className="flex flex-col gap-4"> 
        <Radio
          values={args.values}
          customInput={args.customInput}
        />
        <button type='submit'>
          Submit
        </button>

      </form>
    )
  },
  args: {
    values: ['Option 1', 'Option 2', 'Option 3'],
    customInput: true,
  },
}
