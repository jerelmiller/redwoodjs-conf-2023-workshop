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

import PlaceholderCoverPhoto from './PlaceholderCoverPhoto'

const meta: Meta<typeof PlaceholderCoverPhoto> = {
  component: PlaceholderCoverPhoto,
}

export default meta

type Story = StoryObj<typeof PlaceholderCoverPhoto>

export const Primary: Story = {}
