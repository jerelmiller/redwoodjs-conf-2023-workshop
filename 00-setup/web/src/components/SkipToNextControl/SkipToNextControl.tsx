// This component is for show-only as it is not backed by a mutation that can
// handle changing tracks.
import { SkipForward } from 'lucide-react'

import PlaybarControlButton from 'src/components/PlaybarControlButton'

const SkipToNextControl = () => {
  return (
    <PlaybarControlButton disabled tooltip="Next">
      <SkipForward fill="currentColor" />
    </PlaybarControlButton>
  )
}

export default SkipToNextControl
