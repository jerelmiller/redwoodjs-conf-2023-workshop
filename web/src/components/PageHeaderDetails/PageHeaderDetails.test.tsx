import { render } from '@redwoodjs/testing/web'

import PageHeaderDetails from './PageHeaderDetails'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PageHeaderDetails', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PageHeaderDetails />)
    }).not.toThrow()
  })
})
