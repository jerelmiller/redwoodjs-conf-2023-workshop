import { ReactNode, useRef } from 'react'
import cx from 'classnames'

interface ScrollableListProps {
  children?: ReactNode
  className?: string
  onScrollToEnd?: () => void
}

const ScrollableList = ({ children, className }: ScrollableListProps) => {
  const ref = useRef<HTMLDivElement>()

  return (
    <div ref={ref} className={cx('overflow-y-auto', className)}>
      {children}
    </div>
  )
}

export default ScrollableList
