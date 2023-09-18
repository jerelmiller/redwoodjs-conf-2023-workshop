import { RefObject, createContext } from 'react'

const ScrollableListContext = createContext<RefObject<Element | null>>({
  current: null,
})

export default ScrollableListContext
