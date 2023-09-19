import { ReactNode } from 'react'

interface PageHeaderContentProps {
  children?: ReactNode
}

const PageHeaderContent = ({ children }: PageHeaderContentProps) => {
  return (
    <div className="flex max-h-[250px] flex-1 flex-col gap-2">{children}</div>
  )
}

export default PageHeaderContent
