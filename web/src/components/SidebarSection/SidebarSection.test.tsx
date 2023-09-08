import { render } from '@redwoodjs/testing/web'

import SidebarSection from './SidebarSection'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SidebarSection', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SidebarSection />)
    }).not.toThrow()
  })
})
