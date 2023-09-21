import { ReactNode } from 'react'

interface EmptyStateProps {
  children?: ReactNode
}

const EmptyState = ({ children }: EmptyStateProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      {children}
    </div>
  )
}

export default EmptyState
