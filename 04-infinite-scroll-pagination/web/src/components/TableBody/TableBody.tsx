import { ReactNode } from 'react'

interface TableBodyProps {
  children?: ReactNode
}

const TableBody = ({ children }: TableBodyProps) => {
  return (
    <tbody className="before:block before:leading-4 before:content-['\200C']">
      {children}
    </tbody>
  )
}

export default TableBody
