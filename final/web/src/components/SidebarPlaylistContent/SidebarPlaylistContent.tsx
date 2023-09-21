import { ReactNode } from 'react'

interface SidebarPlaylistContentProps {
  children?: ReactNode
}

const SidebarPlaylistContent = ({ children }: SidebarPlaylistContentProps) => {
  return (
    <div className="flex flex-1 flex-col justify-around self-stretch overflow-hidden text-ellipsis whitespace-nowrap">
      {children}
    </div>
  )
}

export default SidebarPlaylistContent
