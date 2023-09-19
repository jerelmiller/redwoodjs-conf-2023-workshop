import { ReactNode } from 'react'

interface PageHeaderProps {
  children?: ReactNode
}

const PageHeader = ({ children }: PageHeaderProps) => {
  return (
    <div className="relative p-[var(--main-content--padding)] transition duration-200 ease-out [background:var(--backdrop-color)]">
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0,rgba(0,0,0,0.5)_100%)]" />
      <div className="isolate flex items-end gap-8">{children}</div>
    </div>
  )
}

export default PageHeader
