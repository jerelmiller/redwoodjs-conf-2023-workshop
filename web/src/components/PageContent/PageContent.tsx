import { CSSProperties, ReactNode } from 'react'

import cx from 'classnames'

interface PageContentProps {
  children?: ReactNode
  gap?: CSSProperties['gap']
}

const PageContent = ({ children, gap }: PageContentProps) => {
  return (
    <div className="relative flex-1 bg-black-base">
      <div
        className={cx(
          'absolute h-[230px] w-full transition duration-200 ease-out [background:var(--backdrop-color)]',
          'after:absolute after:inset-0 after:bg-[linear-gradient(rgba(0,0,0,0.6)_0,var(--background--base)_100%)]'
        )}
      />
      <div
        className="isolate flex-1 flex-col gap-4 p-[var(--main-content--padding)]"
        style={{ gap }}
      >
        {children}
      </div>
    </div>
  )
}

export default PageContent
