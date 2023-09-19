import { ReactNode, useState } from 'react'

import * as Dropdown from '@radix-ui/react-dropdown-menu'

import Content from './Content'
import Item from './Item'
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

DropdownMenu.Content = Content
DropdownMenu.Item = Item
DropdownMenu.Separator = Separator
DropdownMenu.Trigger = Trigger

export default DropdownMenu
