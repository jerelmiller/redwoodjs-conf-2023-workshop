import { ReactNode } from 'react'

import DelimitedList from 'src/components/DelimitedList'

interface MediaTileDetailsProps {
  children?: ReactNode
}

const MediaTileDetails = ({ children }: MediaTileDetailsProps) => {
  return (
    <div className="line-clamp-2 text-sm text-muted">
      <DelimitedList delimiter=" · ">{children}</DelimitedList>
    </div>
  )
}

export default MediaTileDetails
