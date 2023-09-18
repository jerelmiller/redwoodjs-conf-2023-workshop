import { render } from '@redwoodjs/testing/web'

import PlaylistPage from './PlaylistPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('PlaylistPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PlaylistPage />)
    }).not.toThrow()
  })
})
