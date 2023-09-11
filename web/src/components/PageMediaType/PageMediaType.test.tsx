import { render } from '@redwoodjs/testing/web'

import PageMediaType from './PageMediaType'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PageMediaType', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PageMediaType />)
    }).not.toThrow()
  })
})
