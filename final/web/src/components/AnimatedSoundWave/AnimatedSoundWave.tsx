import { CSSProperties } from 'react'

import cx from 'classnames'

interface AnimatedSoundWaveProps {
  className?: string
  size?: CSSProperties['width']
}

interface StyleProps extends CSSProperties {
  '--animated-sound-wave--size': CSSProperties['width']
}

const AnimatedSoundWave = ({
  className,
  size = '1rem',
}: AnimatedSoundWaveProps) => {
  return (
    <div
      style={{ '--animated-sound-wave--size': size } as StyleProps}
      className={cx(
        'grid aspect-square w-[var(--animated-sound-wave--size)] gap-[0.125rem] overflow-hidden [grid-template-columns:repeat(5,minmax(2px,1fr))]',
        className
      )}
    >
      <Bar className="[animation-duration:474ms]" />
      <Bar className="[animation-duration:433ms]" />
      <Bar className="[animation-duration:407ms]" />
      <Bar className="[animation-duration:458ms]" />
      <Bar className="[animation-duration:400ms]" />
    </div>
  )
}

interface BarProps {
  className?: string
}

const Bar = ({ className }: BarProps) => {
  return (
    <div
      className={cx(
        'h-full w-full animate-sound-wave bg-theme-light',
        className
      )}
    />
  )
}

export default AnimatedSoundWave
