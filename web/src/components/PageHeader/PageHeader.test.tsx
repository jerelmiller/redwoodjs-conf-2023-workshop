import { render } from '@redwoodjs/testing/web'

import PageHeader from './PageHeader'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PageHeader', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PageHeader />)
    }).not.toThrow()
  })
})
