import { ReactNode } from 'react'

interface PageTitleProps {
  children?: ReactNode
}

const PageTitle = ({ children }: PageTitleProps) => {
  return (
    <h1 className="line-clamp-2 overflow-hidden text-8xl font-black">
      {children}
    </h1>
  )
}

export default PageTitle
