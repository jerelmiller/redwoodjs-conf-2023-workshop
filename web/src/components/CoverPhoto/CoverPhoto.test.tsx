import { render } from '@redwoodjs/testing/web'

import CoverPhoto from './CoverPhoto'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CoverPhoto', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CoverPhoto />)
    }).not.toThrow()
  })
})
