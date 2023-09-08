import { render } from '@redwoodjs/testing/web'

import LazyImage from './LazyImage'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('LazyImage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LazyImage />)
    }).not.toThrow()
  })
})
