import { ComponentPropsWithoutRef, ReactNode } from 'react'

import { NavLink } from '@redwoodjs/router'

type NavLinkProps = ComponentPropsWithoutRef<typeof NavLink>

interface SidebarPlaylistLinkProps {
  children: ReactNode
  to: NavLinkProps['to']
}

const SidebarPlaylistLink = ({ children, to }: SidebarPlaylistLinkProps) => {
  return (
    <li>
      <NavLink
        to={to}
        className="transition-color flex items-center justify-between gap-3 rounded-md py-2 pl-2 pr-4 leading-none transition-colors duration-200 ease-out hover:bg-[#1A1A1A] hover:no-underline"
        activeClassName="bg-surface text-primary hover:bg-[#393939]"
      >
        {children}
      </NavLink>
    </li>
  )
}

export default SidebarPlaylistLink
