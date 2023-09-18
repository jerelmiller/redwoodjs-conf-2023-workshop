import { ReactNode } from 'react'

interface TableHeadProps {
  children: ReactNode
}

const TableHead = ({ children }: TableHeadProps) => {
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  )
}

export default TableHead
