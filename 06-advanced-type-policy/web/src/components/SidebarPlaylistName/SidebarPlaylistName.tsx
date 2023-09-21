import { ReactNode } from 'react'

import cx from 'classnames'

interface SidebarPlaylistNameProps {
  children: ReactNode
  isCurrentContext: boolean
}

const SidebarPlaylistName = ({
  children,
  isCurrentContext,
}: SidebarPlaylistNameProps) => {
  return (
    <div
      className={cx('overflow-hidden text-ellipsis whitespace-nowrap', {
        'text-theme-light': isCurrentContext,
      })}
    >
      {children}
    </div>
  )
}

export default SidebarPlaylistName
