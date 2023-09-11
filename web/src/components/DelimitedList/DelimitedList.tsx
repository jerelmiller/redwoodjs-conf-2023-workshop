import {
  Children,
  ElementType,
  Fragment,
  ReactNode,
  isValidElement,
} from 'react'

export interface DelimitedListProps {
  children: ReactNode
  className?: string
  delimiter: string
}

const DelimitedList = ({ children, delimiter }: DelimitedListProps) => {
  return Children.toArray(children).map((child, index, list) => {
    const key = isValidElement(child) ? child.key ?? index : index

    return (
      <Fragment key={key}>
        {child}
        {index !== list.length - 1 && delimiter}
      </Fragment>
    )
  })
}

export default DelimitedList
