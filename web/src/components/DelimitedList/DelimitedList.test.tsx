import { render } from '@redwoodjs/testing/web'

import DelimitedList from './DelimitedList'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('DelimitedList', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DelimitedList />)
    }).not.toThrow()
  })
})
