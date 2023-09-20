import { ElementType } from 'react'

import cx from 'classnames'
import { LucideProps } from 'lucide-react'

export interface PlaceholderCoverPhotoProps {
  className?: string
  icon: ElementType<LucideProps>
}

const PlaceholderCoverPhoto = ({
  className,
  icon: Icon,
}: PlaceholderCoverPhotoProps) => {
  return (
    <div
      className={cx(
        'relative flex aspect-square w-full items-center justify-center [background:var(--placeholder--cover-photo--background,var(--background--surface))]',
        className
      )}
    >
      <Icon className="absolute" strokeWidth={1} size="30%" />
    </div>
  )
}

export default PlaceholderCoverPhoto
