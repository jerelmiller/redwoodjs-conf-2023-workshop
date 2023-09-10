// Pass props to your component by passing an `args` object to your story
//
// ```jsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { Meta, StoryObj } from '@storybook/react'

import DropdownMenu from './DropdownMenu'

const meta: Meta<typeof DropdownMenu> = {
  component: DropdownMenu,
}

export default meta

type Story = StoryObj<typeof DropdownMenu>

export const Primary: Story = {}
