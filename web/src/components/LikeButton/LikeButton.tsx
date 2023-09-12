import cx from 'classnames'
import { Heart, LucideProps } from 'lucide-react'

import Tooltip from 'src/components/Tooltip'

export interface LikeButtonProps {
  className?: string
  disabled?: boolean
  liked: boolean
  onClick?: () => void
  size?: LucideProps['size']
}

const LikeButton = ({
  disabled,
  className,
  liked,
  onClick,
  size,
}: LikeButtonProps) => {
  return (
    <Tooltip
      content={liked ? 'Remove from Your Library' : 'Save to Your Library'}
    >
      <button
        disabled={disabled}
        className={cx(
          'cursor-pointer border-none bg-none text-muted outline-0 transition-colors ease-out hover:text-primary disabled:pointer-events-none disabled:text-muted disabled:opacity-30',
          className,
          { 'text-theme hover:text-theme-light': liked }
        )}
        onClick={onClick}
      >
        <Heart
          className="max-w-[unset]"
          fill={liked ? 'currentColor' : 'transparent'}
          size={size}
        />
      </button>
    </Tooltip>
  )
}

export default LikeButton
