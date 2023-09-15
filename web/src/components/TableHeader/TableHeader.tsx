import { ReactNode } from 'react'
import cx from 'classnames'

interface TableHeaderProps {
  alignText?: 'left' | 'center' | 'right'
  colSpan?: number
  children?: ReactNode
}

const TableHeader = ({
  alignText = 'left',
  children,
  colSpan,
}: TableHeaderProps) => {
  return (
    <th
      className={cx(
        'whitespace-nowrap text-xs font-normal uppercase tracking-widest text-muted',
        'border-b border-solid border-primary',
        'p-2',
        'first:pl-4 last:pr-4 [&>svg]:inline-block',
        {
          'text-left': alignText === 'left',
          'text-center': alignText === 'center',
          'text-right': alignText === 'right',
        }
      )}
      colSpan={colSpan}
    >
      {children}
    </th>
  )
}

export default TableHeader
