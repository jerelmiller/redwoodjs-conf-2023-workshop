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

import CoverPhoto from './CoverPhoto'

const meta: Meta<typeof CoverPhoto> = {
  component: CoverPhoto,
}

export default meta

type Story = StoryObj<typeof CoverPhoto>

export const Primary: Story = {}
