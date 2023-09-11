import { render } from '@redwoodjs/testing/web'

import PageContainer from './PageContainer'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PageContainer', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PageContainer />)
    }).not.toThrow()
  })
})
