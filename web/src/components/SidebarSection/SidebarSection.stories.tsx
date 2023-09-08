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

import SidebarSection from './SidebarSection'

const meta: Meta<typeof SidebarSection> = {
  component: SidebarSection,
}

export default meta

type Story = StoryObj<typeof SidebarSection>

export const Primary: Story = {}
