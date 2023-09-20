import { ComponentPropsWithoutRef } from 'react'

import cx from 'classnames'

import { NavLink } from '@redwoodjs/router'

type SidebarNavLinkProps = Omit<
  ComponentPropsWithoutRef<typeof NavLink>,
  'activeClassName'
>

const SidebarNavLink = ({
  children,
  className,
  ...props
}: SidebarNavLinkProps) => {
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
        {children}
      </NavLink>
    </li>
  )
}

export default SidebarNavLink
