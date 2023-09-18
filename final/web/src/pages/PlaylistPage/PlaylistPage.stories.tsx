import type { Meta, StoryObj } from '@storybook/react'

import PlaylistPage from './PlaylistPage'

const meta: Meta<typeof PlaylistPage> = {
  component: PlaylistPage,
}

export default meta

type Story = StoryObj<typeof PlaylistPage>

export const Primary: Story = {}
