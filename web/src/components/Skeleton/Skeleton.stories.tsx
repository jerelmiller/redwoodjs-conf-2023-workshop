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

import Skeleton from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
}

export default meta

type Story = StoryObj<typeof Skeleton>

export const Primary: Story = {}
