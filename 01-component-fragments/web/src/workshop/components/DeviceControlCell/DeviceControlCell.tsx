import { Laptop2 } from 'lucide-react'

import PlaybarControlButton from 'src/components/PlaybarControlButton'

export const Success = () => {
  return (
    <PlaybarControlButton disabled={false} tooltip="Connect to a device">
      <Laptop2 strokeWidth={1.5} />
    </PlaybarControlButton>
  )
}
