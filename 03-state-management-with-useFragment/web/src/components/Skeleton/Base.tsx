import { ComponentPropsWithoutRef, ElementType } from 'react'

import cx from 'classnames'

interface BaseProps<TElement extends ElementType> {
  as?: TElement
  className?: string
}

const Base = <TElement extends ElementType = 'div'>({
  as,
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<TElement>, keyof BaseProps<TElement>> &
  BaseProps<TElement>) => {
  const Element = as || 'div'

  return (
    <Element
      {...props}
      className={cx(
        className,
        'relative overflow-hidden rounded-2xl bg-surface opacity-50',
        'after:absolute after:inset-0 after:translate-x-[-100%] after:animate-shimmer',
        'after:[background-image:linear-gradient(90deg,rgba(55,55,55,0)_0,rgba(55,55,55,0.2)_20%,rgba(55,55,55,0.5)_60%,rgba(55,55,55,0))]'
      )}
    />
  )
}

export default Base
