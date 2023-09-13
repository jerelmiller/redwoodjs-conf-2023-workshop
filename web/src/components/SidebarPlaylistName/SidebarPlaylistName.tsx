import { ReactNode } from 'react'

import cx from 'classnames'

interface SidebarPlaylistNameProps {
  children: ReactNode
}

const SidebarPlaylistName = ({ children }: SidebarPlaylistNameProps) => {
  const isCurrentContext = false

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
