import { ReactNode } from 'react'

interface EmptyStateDescriptionProps {
  children?: ReactNode
}

const EmptyStateDescription = ({ children }: EmptyStateDescriptionProps) => {
  return <p className="text-muted">{children}</p>
}

export default EmptyStateDescription
