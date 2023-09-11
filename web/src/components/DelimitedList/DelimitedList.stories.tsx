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

import DelimitedList from './DelimitedList'

const meta: Meta<typeof DelimitedList> = {
  component: DelimitedList,
}

export default meta

type Story = StoryObj<typeof DelimitedList>

export const Primary: Story = {}
