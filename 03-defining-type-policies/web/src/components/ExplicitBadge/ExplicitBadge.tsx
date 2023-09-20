import cx from 'classnames'

interface ExplicitBadgeProps {
  className?: string
}

const ExplicitBadge = ({ className }: ExplicitBadgeProps) => {
  return (
    <span
      className={cx(
        'inline-flex h-4 items-center justify-center rounded-sm bg-[hsla(0,0%,100%,0.6)] p-1 text-[0.5625rem] text-black-base',
        className
      )}
      aria-label="Explicit"
      title="Explicit"
    >
      E
    </span>
  )
}

export default ExplicitBadge
