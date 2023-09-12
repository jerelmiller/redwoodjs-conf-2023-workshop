import { CSSProperties, ReactNode } from 'react'

import cx from 'classnames'

interface PageContainerProps {
  bgColor?: string | null
  children?: ReactNode
  className?: string
}

interface BackdropStyle extends CSSProperties {
  '--backdrop-color': string
}

const PageContainer = ({
  bgColor,
  children,
  className,
}: PageContainerProps) => {
  return (
    <div
      className={cx(className, 'flex flex-1 flex-col')}
      style={{ '--backdrop-color': bgColor } as BackdropStyle}
    >
      {children}
    </div>
  )
}

export default PageContainer
