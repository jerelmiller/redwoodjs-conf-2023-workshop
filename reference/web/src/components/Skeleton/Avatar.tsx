import { CSSProperties } from 'react'

import Base from './Base'

interface AvatarProps {
  size: CSSProperties['width']
}

interface StyleProps extends CSSProperties {
  '--skeleton--avatar--size': CSSProperties['width']
}

const Avatar = ({ size }: AvatarProps) => {
  return (
    <Base
      className="h-[var(--skeleton--avatar--size)] w-[var(--skeleton--avatar--size)] rounded-full"
      style={{ '--skeleton--avatar--size': size } as StyleProps}
    />
  )
}

export default Avatar
