import { Heart } from 'lucide-react'

import GradientIcon, { GradientIconProps } from 'src/components/GradientIcon'

interface LikedTracksCoverPhotoProps {
  className?: string
  iconSize?: GradientIconProps['iconSize']
  size?: GradientIconProps['size']
}

const LikedTracksCoverPhoto = ({
  iconSize,
  className,
  size,
}: LikedTracksCoverPhotoProps) => {
  return (
    <GradientIcon
      className={className}
      backgroundColor="linear-gradient(135deg,#450af5,#c4efd9)"
      lucideIcon={Heart}
      iconSize={iconSize}
      size={size}
    />
  )
}

export default LikedTracksCoverPhoto
