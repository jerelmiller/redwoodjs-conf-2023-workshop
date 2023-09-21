import { ReactNode } from 'react'

interface EmptyStateTitleProps {
  children?: ReactNode
}

const EmptyStateTitle = ({ children }: EmptyStateTitleProps) => {
  return <h1 className="mb-0">{children}</h1>
}

export default EmptyStateTitle
