import { render } from '@redwoodjs/testing/web'

import PageTitle from './PageTitle'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PageTitle', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PageTitle />)
    }).not.toThrow()
  })
})
