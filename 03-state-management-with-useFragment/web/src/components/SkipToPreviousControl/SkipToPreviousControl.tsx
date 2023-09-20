// This component is for show-only as it is not backed by a mutation that can
// handle changing tracks.
import { SkipBack } from 'lucide-react'

import PlaybarControlButton from 'src/components/PlaybarControlButton'

const SkipToPreviousControl = () => {
  return (
    <PlaybarControlButton disabled tooltip="Previous">
      <SkipBack fill="currentColor" />
    </PlaybarControlButton>
  )
}

export default SkipToPreviousControl
