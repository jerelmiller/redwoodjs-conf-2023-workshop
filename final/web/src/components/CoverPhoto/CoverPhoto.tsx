import { ElementType, CSSProperties } from 'react'

import cx from 'classnames'
import { LucideProps, Music } from 'lucide-react'

import LazyImage from 'src/components/LazyImage'
import PlaceholderCoverPhoto from 'src/components/PlaceholderCoverPhoto'

interface Image {
  url: string
}

export interface CoverPhotoProps {
  className?: string
  image: Image | null | undefined
  size?: string
  animateIn?: boolean
  placeholderIcon?: ElementType<LucideProps>
  shape?: 'square' | 'circle'
}

interface StyleProps extends CSSProperties {
  '--cover-photo--size': CSSProperties['width']
}

const CoverPhoto = ({
  className,
  image,
  placeholderIcon = Music,
  size,
  animateIn = true,
  shape = 'square',
}: CoverPhotoProps) => {
  return (
    <div
      className={cx(
        'aspect-square w-[var(--cover-photo--size)] overflow-hidden',
        className,
        {
          rounded: shape === 'square',
          'rounded-full': shape === 'circle',
        }
      )}
      style={{ '--cover-photo--size': size } as StyleProps}
    >
      {image ? (
        <LazyImage
          animateIn={animateIn}
          className="aspect-square object-cover"
          src={image.url}
        />
      ) : (
        <PlaceholderCoverPhoto
          className="aspect-square object-cover"
          icon={placeholderIcon}
        />
      )}
    </div>
  )
}

export default CoverPhoto
