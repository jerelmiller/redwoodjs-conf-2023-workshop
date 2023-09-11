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

import PageCoverPhoto from './PageCoverPhoto'

const meta: Meta<typeof PageCoverPhoto> = {
  component: PageCoverPhoto,
}

export default meta

type Story = StoryObj<typeof PageCoverPhoto>

export const Primary: Story = {}
