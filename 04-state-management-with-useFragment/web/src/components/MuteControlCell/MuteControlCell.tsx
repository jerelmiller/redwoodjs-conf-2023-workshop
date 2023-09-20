import { MuteControlCell_device } from 'types/graphql'

import PlaybarControlButton from 'src/components/PlaybarControlButton'
import VolumeIcon from 'src/components/VolumeIcon'
import { useSetVolumeMutation } from 'src/mutations/useSetVolumeMutation'

interface MuteControlCellProps {
  activeDevice: MuteControlCell_activeDevice | null | undefined
}

const MuteControlCell = ({ activeDevice }: MuteControlCellProps) => {
  const setVolume = useSetVolumeMutation()
  const volumePercent = activeDevice?.volumePercent ?? 0

  return (
    <PlaybarControlButton
      disabled={!activeDevice}
      tooltip={volumePercent === 0 ? 'Unmute' : 'Mute'}
      onClick={() =>
        setVolume({ volumePercent: volumePercent === 0 ? 100 : 0 })
      }
    >
      <VolumeIcon volumePercent={volumePercent} />
    </PlaybarControlButton>
  )
}

MuteControlCell.fragments = {
  device: gql`
    fragment MuteControlCell_activeDevice on Device {
      id
      volumePercent
    }
  `,
}

export default MuteControlCell
