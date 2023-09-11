import { CSSProperties } from 'react'
import cx from 'classnames'
import { Play, Pause } from 'lucide-react'
import Tooltip from 'src/components/Tooltip'

type PlayButtonProps = {
  className?: string
  disabled?: boolean
  size: CSSProperties['width']
  playing: boolean
  variant: 'primary' | 'secondary'
  onClick?: () => void
}

interface StyleProps extends CSSProperties {
  '--play-button--size': CSSProperties['width']
}

const PlayButton = ({
  className,
  disabled,
  playing,
  variant,
  onClick,
  size,
}: PlayButtonProps) => {
  return (
    <Tooltip content={playing ? 'Pause' : 'Play'}>
      <button
        disabled={disabled}
        className={cx(
          className,
          'flex h-[var(--play-button--size)] w-[var(--play-button--size)] scale-100 transform-gpu cursor-pointer items-center justify-center rounded-full border-2 border-solid p-0 transition-all ease-in-out [backface-visibility:hidden]',
          '[&:active:not(:disabled)]:scale-105 [&:hover:not(:disabled)]:scale-110',
          'focus:outline-0',
          'disabled:cursor-not-allowed disabled:opacity-25',
          {
            'border-green-light bg-green-light text-black-pure':
              variant === 'primary',
            'border-white bg-white text-black-pure': variant === 'secondary',
          }
        )}
        style={{ '--play-button--size': size } as StyleProps}
        onClick={onClick}
      >
        {playing ? (
          <Pause size="60%" fill="currentColor" />
        ) : (
          <Play className="relative left-[5%]" size="60%" fill="currentColor" />
        )}
      </button>
    </Tooltip>
  )
}

export default PlayButton
