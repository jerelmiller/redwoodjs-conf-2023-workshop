import { ReactNode } from 'react'

interface PageHeaderDetailsProps {
  children?: ReactNode
}

const PageHeaderDetails = ({ children }: PageHeaderDetailsProps) => {
  return (
    <div className='items-center text-sm [&>:not(:first-child)]:before:mx-1 [&>:not(:first-child)]:before:my-0 [&>:not(:first-child)]:before:content-["·"]'>
      {children}
    </div>
  )
}

export default PageHeaderDetails
