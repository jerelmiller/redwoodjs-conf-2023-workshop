import { MouseEvent, ReactNode } from 'react'

interface TableRowProps {
  children?: ReactNode
  onDoubleClick?: (event: MouseEvent<HTMLTableRowElement>) => void
}

const TableRow = ({ children, onDoubleClick }: TableRowProps) => {
  return (
    <tr
      onDoubleClick={onDoubleClick}
      className="group peer -mx-4 my-0 px-4 py-0 [&>td]:hover:bg-surface-active"
    >
      {children}
    </tr>
  )
}

export default TableRow
