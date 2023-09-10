import { render } from '@redwoodjs/testing/web'

import DropdownMenu from './DropdownMenu'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('DropdownMenu', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DropdownMenu />)
    }).not.toThrow()
  })
})
