import { CSSProperties, ReactNode } from 'react'

import cx from 'classnames'

interface TableCellProps {
  children?: ReactNode
  shrink?: boolean
  wrap?: boolean
  columnWidth?: CSSProperties['width']
}

const TableCell = ({
  children,
  columnWidth,
  shrink = false,
  wrap = true,
}: TableCellProps) => {
  return (
    <td
      className={cx(
        'px-2 py-3 text-left first:rounded-bl first:rounded-tl first:pl-4 last:rounded-bl last:rounded-br last:pr-4',
        {
          'w-px': shrink,
          'whitespace-nowrap': !wrap,
        }
      )}
      style={{ width: columnWidth }}
    >
      {children}
    </td>
  )
}

export default TableCell
