import { ComponentPropsWithoutRef, ElementType, ReactNode, useRef } from 'react'

import cx from 'classnames'

import ScrollableListContext from '../ScrollableListContext/ScrollableListContext'

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
      <ScrollableListContext.Provider value={ref}>
        {children}
      </ScrollableListContext.Provider>
    </Component>
  )
}

export default ScrollableList
