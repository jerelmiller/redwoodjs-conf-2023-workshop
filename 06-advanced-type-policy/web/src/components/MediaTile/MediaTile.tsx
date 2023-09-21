import { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Link } from '@redwoodjs/router'

type LinkProps = ComponentPropsWithoutRef<typeof Link>

interface MediaTileProps {
  children?: ReactNode
  to: LinkProps['to']
}

const MediaTile = ({ children, to }: MediaTileProps) => {
  return (
    <Link
      to={to}
      className="flex flex-col gap-4 rounded bg-surface-low-contrast p-4 transition-colors duration-200 ease-out hover:bg-surface-low-contrast-hover hover:no-underline"
    >
      {children}
    </Link>
  )
}

export default MediaTile
