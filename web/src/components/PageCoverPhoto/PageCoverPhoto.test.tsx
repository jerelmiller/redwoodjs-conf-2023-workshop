import { render } from '@redwoodjs/testing/web'

import PageCoverPhoto from './PageCoverPhoto'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PageCoverPhoto', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PageCoverPhoto />)
    }).not.toThrow()
  })
})
