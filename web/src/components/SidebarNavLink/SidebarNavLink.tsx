import {
  cloneElement,
  ComponentPropsWithoutRef,
  ReactElement,
  ReactNode,
} from 'react'
import { NavLink } from '@redwoodjs/router'
import cx from 'classnames'

type ForwardedProps = Omit<
  ComponentPropsWithoutRef<typeof NavLink>,
  'activeClassName'
>

interface SidebarNavLinkProps {
  icon?: ReactElement
}

const SidebarNavLink = ({
  children,
  className,
  icon,
  ...props
}: SidebarNavLinkProps & ForwardedProps) => {
  return (
    <li className="px-0 py-1 leading-none text-muted transition-colors duration-200 ease-out hover:text-primary">
      <NavLink
        {...props}
        activeClassName="text-primary"
        className={cx(
          'transition-color flex items-center gap-4 py-2 duration-200 ease-out hover:no-underline',
          className
        )}
      >
        {icon}
        {children}
      </NavLink>
    </li>
  )
}

export default SidebarNavLink
