import { render } from '@redwoodjs/testing/web'

import ApolloLogo from './ApolloLogo'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ApolloLogo', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ApolloLogo />)
    }).not.toThrow()
  })
})
