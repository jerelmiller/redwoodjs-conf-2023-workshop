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

import PageContent from './PageContent'

const meta: Meta<typeof PageContent> = {
  component: PageContent,
}

export default meta

type Story = StoryObj<typeof PageContent>

export const Primary: Story = {}
