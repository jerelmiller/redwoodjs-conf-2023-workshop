import { ComponentPropsWithoutRef, ReactNode } from 'react'

import * as Dropdown from '@radix-ui/react-dropdown-menu'
import type { DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu'
import cx from 'classnames'
import { ExternalLink } from 'lucide-react'

import { Link } from '@redwoodjs/router'

type LinkProps = ComponentPropsWithoutRef<typeof Link>

interface ItemProps {
  children?: ReactNode
  disabled?: boolean
  onSelect?: DropdownMenuItemProps['onSelect']
  to?: LinkProps['to']
}

const Item = ({ children, disabled, onSelect, to }: ItemProps) => {
  const props = {
    children,
    className: 'flex items-center p-2 text-sm hover:no-underline',
  }

  const isExternal =
    typeof to === 'string' && (to.startsWith('http') || to?.match(/\.[a-z]+$/))

  return (
    <Dropdown.Item asChild disabled={disabled} onSelect={onSelect}>
      <li
        className={
          'rounded outline-0 data-[disabled]:pointer-events-none data-[highlighted]:cursor-pointer data-[highlighted]:bg-surface-active data-[disabled]:text-muted'
        }
      >
        {isExternal ? (
          <a
            {...props}
            href={to}
            target="_blank"
            rel="noreferrer"
            className={cx(
              // eslint-disable-next-line react/prop-types
              props.className,
              'justify-between'
            )}
          >
            {props.children}
            <ExternalLink size="1.25rem" strokeWidth={1.5} />
          </a>
        ) : to ? (
          <Link to={to} {...props} />
        ) : (
          <button {...props} />
        )}
      </li>
    </Dropdown.Item>
  )
}

export default Item
