import { CSSProperties } from 'react'
import LazyImage from 'src/components/LazyImage'

interface AvatarProps {
  imageUrl: string
  size?: CSSProperties['width']
}

const Avatar = ({ imageUrl, size }: AvatarProps) => {
  return (
    <LazyImage
      className="aspect-square overflow-hidden rounded-full"
      src={imageUrl}
      style={{ width: size }}
    />
  )
}

export default Avatar
