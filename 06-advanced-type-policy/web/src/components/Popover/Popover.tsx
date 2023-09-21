import { ReactNode } from 'react'

import * as RadixPopover from '@radix-ui/react-popover'

type ForwardedPopoverProps = Pick<RadixPopover.PopoverContentProps, 'side'>

interface OwnPopoverProps {
  children: ReactNode
  content: ReactNode
}

type PopoverProps = ForwardedPopoverProps & OwnPopoverProps

const Popover = ({ children, content, side = 'top' }: PopoverProps) => {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          side={side}
          sideOffset={8}
          className="data-open-data-side-right:animate-slide-right-fade w-80 rounded bg-surface p-4 text-white shadow-md duration-300 ease-out will-change-[transform,opacity] data-open:data-side-bottom:animate-slide-down-fade data-open:data-side-left:animate-slide-left-fade data-open:data-side-top:animate-slide-up-fade"
        >
          {content}
          <RadixPopover.Arrow className="fill-surface" width={16} height={8} />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}

export default Popover
