import { render } from '@redwoodjs/testing/web'

import PageContent from './PageContent'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PageContent', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PageContent />)
    }).not.toThrow()
  })
})
