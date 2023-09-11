import { ReactNode } from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'

type ForwardedTooltipRootProps = Pick<
  RadixTooltip.TooltipProps,
  'open' | 'onOpenChange'
>

type ForwardedTooltipContentProps = Pick<
  RadixTooltip.TooltipContentProps,
  'side'
>

interface OwnTooltipProps {
  children: ReactNode
  content: ReactNode
  delay?: number
}

type TooltipProps = OwnTooltipProps &
  ForwardedTooltipRootProps &
  ForwardedTooltipContentProps

const Tooltip = ({
  children,
  content,
  delay,
  side,
  open,
  onOpenChange,
}: TooltipProps) => {
  return (
    <RadixTooltip.Root
      delayDuration={delay}
      open={open}
      onOpenChange={onOpenChange}
    >
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          className="line-clamp-4 max-w-[50ch] overflow-hidden text-ellipsis rounded bg-surface px-2 py-1 text-sm text-primary shadow-lg data-open:animate-fade-in"
          sideOffset={10}
        >
          {content}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}

export default Tooltip
