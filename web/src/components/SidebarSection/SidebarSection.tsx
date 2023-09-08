import { ReactNode } from 'react'
import cx from 'classnames'

interface SidebarSectionProps {
  children?: ReactNode
  className?: string
}

const SidebarSection = ({ className, children }: SidebarSectionProps) => (
  <ul
    className={cx(
      'mt-2 list-none rounded-md bg-black-base first:mt-0',
      className
    )}
  >
    {children}
  </ul>
)

export default SidebarSection
