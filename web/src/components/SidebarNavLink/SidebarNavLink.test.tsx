import { render } from '@redwoodjs/testing/web'

import SidebarNavLink from './SidebarNavLink'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SidebarNavLink', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SidebarNavLink />)
    }).not.toThrow()
  })
})
