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

import SidebarNavLink from './SidebarNavLink'

const meta: Meta<typeof SidebarNavLink> = {
  component: SidebarNavLink,
}

export default meta

type Story = StoryObj<typeof SidebarNavLink>

export const Primary: Story = {}
