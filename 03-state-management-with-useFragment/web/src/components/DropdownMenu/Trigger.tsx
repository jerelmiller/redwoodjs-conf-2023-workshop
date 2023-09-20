import { ReactNode } from 'react'

import * as Dropdown from '@radix-ui/react-dropdown-menu'
import cx from 'classnames'
import { ChevronDown } from 'lucide-react'

import Button, { ButtonProps } from 'src/components/Button'

type TriggerProps = ButtonProps & {
  className?: string
  children?: ReactNode
  disabled?: boolean
}

const Trigger = ({ className, children, disabled, ...props }: TriggerProps) => {
  return (
    <Dropdown.Trigger asChild disabled={disabled}>
      <Button {...props} className={cx(className, 'group flex gap-2')}>
        {children}
        <ChevronDown
          className={
            'transition-transform duration-150 ease-out group-data-open:rotate-180'
          }
          size="1rem"
        />
      </Button>
    </Dropdown.Trigger>
  )
}

export default Trigger
