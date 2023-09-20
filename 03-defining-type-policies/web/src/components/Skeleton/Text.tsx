import { CSSProperties } from 'react'

import cx from 'classnames'

import Base from './Base'

interface TextProps {
  className?: string
  fontSize?: CSSProperties['fontSize']
  width?: CSSProperties['width']
}

interface StyleProps extends CSSProperties {
  '--skeleton--text--width': CSSProperties['width']
  '--skeleton--text--font-size': CSSProperties['fontSize']
}

const Text = ({ className, fontSize, width }: TextProps) => {
  return (
    <Base
      className={cx(
        'h-[1em] w-[var(--skeleton--text--width,100%)] [font-size:var(--skeleton--text--font-size)]',
        className
      )}
      style={
        {
          '--skeleton--text--width': width,
          '--skeleton--text--font-size': fontSize,
        } as StyleProps
      }
    />
  )
}

export default Text
