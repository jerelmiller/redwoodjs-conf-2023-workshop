import { render } from '@redwoodjs/testing/web'

import PlaceholderCoverPhoto from './PlaceholderCoverPhoto'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PlaceholderCoverPhoto', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PlaceholderCoverPhoto />)
    }).not.toThrow()
  })
})
