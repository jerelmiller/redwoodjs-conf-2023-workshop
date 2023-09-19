import { ReactNode } from 'react'

interface MediaTileTitleProps {
  children?: ReactNode
}

const MediaTileTitle = ({ children }: MediaTileTitleProps) => {
  return (
    <span
      className="overflow-hidden text-ellipsis whitespace-nowrap font-bold"
      title={String(children)}
    >
      {children}
    </span>
  )
}

export default MediaTileTitle
