import { ComponentPropsWithoutRef, ElementType, ReactNode, useRef } from 'react'
import cx from 'classnames'

interface ScrollableListProps<T extends ElementType> {
  as?: T
  children?: ReactNode
  className?: string
}

const ScrollableList = <TElement extends ElementType = 'div'>({
  as,
  children,
  className,
  ...props
}: ScrollableListProps<TElement> &
  Omit<
    ComponentPropsWithoutRef<TElement>,
    keyof ScrollableListProps<TElement>
  >) => {
  const ref = useRef(null)
  const Component = as || 'div'

  return (
    <Component
      {...props}
      ref={ref}
      className={cx('overflow-y-auto', className)}
    >
      {children}
    </Component>
  )
}

export default ScrollableList
