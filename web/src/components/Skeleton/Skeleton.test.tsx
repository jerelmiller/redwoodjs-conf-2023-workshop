import { render } from '@redwoodjs/testing/web'

import Skeleton from './Skeleton'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Skeleton', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Skeleton />)
    }).not.toThrow()
  })
})
