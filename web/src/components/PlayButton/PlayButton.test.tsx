import { render } from '@redwoodjs/testing/web'

import PlayButton from './PlayButton'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PlayButton', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PlayButton />)
    }).not.toThrow()
  })
})
