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

import LazyImage from './LazyImage'

const meta: Meta<typeof LazyImage> = {
  component: LazyImage,
}

export default meta

type Story = StoryObj<typeof LazyImage>

export const Primary: Story = {}
