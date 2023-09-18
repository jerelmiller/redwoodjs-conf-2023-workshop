import { CSSProperties } from 'react'

import * as Progress from '@radix-ui/react-progress'
import cx from 'classnames'

interface ProgressBarProps {
  animate?: boolean
  className?: string
  max: number
  value: number
  width?: CSSProperties['width']
  onChange?: (value: number) => void
}

interface StyleProps extends CSSProperties {
  '--progress-bar--width': CSSProperties['width']
}

const ProgressBar = ({
  animate = true,
  className,
  max,
  onChange,
  value,
  width,
}: ProgressBarProps) => {
  max = max === 0 ? 1 : max

  return (
    <Progress.Root
      className={cx(
        'relative block h-[0.375rem] w-[var(--progress-bar--width,100%)] overflow-hidden rounded-2xl border border-solid border-transparent bg-surface-active',
        className,
        { 'cursor-pointer': onChange }
      )}
      max={max}
      value={value}
      style={{ '--progress-bar--width': width } as StyleProps}
      onClick={(event) => {
        if (!onChange || max === 0) {
          return
        }

        const target = event.target as HTMLDivElement
        const rect = target.getBoundingClientRect()
        const percentage = Math.min(
          Math.max(0, (event.clientX - rect.left) / rect.width),
          1
        )

        onChange(Math.floor(percentage * max))
      }}
    >
      <Progress.Indicator
        className={cx(
          'pointer-events-none h-full w-full rounded-2xl bg-white',
          {
            'transition-transform duration-[660ms] ease-[cubic-bezier(0.65,0,0.35,1)]':
              animate,
          }
        )}
        style={{ transform: `translateX(-${100 - (value / max) * 100}%)` }}
      />
    </Progress.Root>
  )
}

export default ProgressBar
