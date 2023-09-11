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

import PageHeader from './PageHeader'

const meta: Meta<typeof PageHeader> = {
  component: PageHeader,
}

export default meta

type Story = StoryObj<typeof PageHeader>

export const Primary: Story = {}
