import { render } from '@redwoodjs/testing/web'

import ScrollableList from './ScrollableList'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ScrollableList', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ScrollableList />)
    }).not.toThrow()
  })
})
