import { ReactNode, useState } from 'react'

import * as Dropdown from '@radix-ui/react-dropdown-menu'

import Item from './Item'
import Menu from './Menu'
import Separator from './Separator'
import Trigger from './Trigger'

interface DropdownMenuProps {
  children?: ReactNode
}

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dropdown.Root open={open} onOpenChange={setOpen}>
      {children}
    </Dropdown.Root>
  )
}

DropdownMenu.Trigger = Trigger
DropdownMenu.Item = Item
DropdownMenu.Menu = Menu
DropdownMenu.Separator = Separator

export default DropdownMenu
