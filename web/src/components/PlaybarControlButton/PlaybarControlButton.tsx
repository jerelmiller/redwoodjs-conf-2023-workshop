import { forwardRef, ReactNode } from 'react'

import cx from 'classnames'

import Tooltip from 'src/components/Tooltip'

interface PlaybarControlButtonProps {
  active?: boolean
  children?: ReactNode
  disallowed: boolean
  tooltip: string
  onClick?: () => void
}

const PlaybarControlButton = forwardRef<
  HTMLButtonElement,
  PlaybarControlButtonProps
>(({ active, children, disallowed, onClick, tooltip }, ref) => {
  return (
    <Tooltip content={tooltip}>
      <button
        ref={ref}
        className={cx(
          'flex h-6 w-6 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-muted transition-colors ease-out hover:text-primary active:text-muted disabled:cursor-not-allowed disabled:text-disabled',
          {
            'relative text-theme after:absolute after:-bottom-2 after:left-1/2 after:block after:h-1 after:w-1 after:-translate-x-1/2 after:rounded after:bg-current hover:text-theme-light':
              active,
          }
        )}
        disabled={disallowed}
        onClick={onClick}
      >
        {children}
      </button>
    </Tooltip>
  )
})

export default PlaybarControlButton
