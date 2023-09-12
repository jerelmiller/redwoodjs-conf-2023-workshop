import { render } from '@redwoodjs/testing/web'

import Table from './Table'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Table', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Table />)
    }).not.toThrow()
  })
})
