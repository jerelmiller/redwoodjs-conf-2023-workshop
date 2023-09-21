import { useRef } from 'react'

import useIntersectionObserver from 'src/hooks/useIntersectionObserver'
import useScrollContainer from 'src/hooks/useScrollContainer'

export interface ScrollableListObserverProps {
  scrollContainer?: Element | null
  threshold?: `${string}px`
  onIntersect?: () => void
}

const ScrollableListObserver = ({
  scrollContainer,
  threshold,
  onIntersect,
}: ScrollableListObserverProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const defaultScrollContainer = useScrollContainer()

  useIntersectionObserver(
    ref,
    {
      root: scrollContainer || defaultScrollContainer,
      rootMargin: `0px 0px ${threshold} 0px`,
    },
    ([entry]) => {
      if (entry.isIntersecting) {
        onIntersect?.()
      }
    }
  )

  return <div ref={ref} />
}

export default ScrollableListObserver
