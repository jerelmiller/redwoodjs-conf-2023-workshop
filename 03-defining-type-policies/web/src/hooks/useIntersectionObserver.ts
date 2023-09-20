import { RefObject, useState, useEffect, useRef } from 'react'

import useDeepMemo from 'src/hooks/useDeepMemo'

const useIntersectionObserver = (
  ref: RefObject<Element | undefined>,
  options: IntersectionObserverInit = {},
  callback: IntersectionObserverCallback = () => {}
) => {
  const callbackRef = useRef(callback)
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const stableOptions = useDeepMemo(() => options, [options])

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const observer = new IntersectionObserver((entries, observer) => {
      setEntry(entries[0])
      callbackRef.current(entries, observer)
    }, stableOptions)

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref, stableOptions])

  return { entry }
}

export default useIntersectionObserver
