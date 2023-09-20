import { VolumeBarControlCell_activeDevice } from 'types/graphql'

import ProgressBar from 'src/components/ProgressBar'
import { useSetVolumeMutation } from 'src/mutations/useSetVolumeMutation'

interface VolumeBarControlCellProps {
  activeDevice: VolumeBarControlCell_activeDevice | null | undefined
}

const VolumeBarControlCell = ({ activeDevice }: VolumeBarControlCellProps) => {
  const setVolume = useSetVolumeMutation()

  return (
    <ProgressBar
      animate={false}
      disabled={!activeDevice}
      value={activeDevice?.volumePercent ?? 0}
      max={100}
      width="100px"
      onChange={(volumePercent) => {
        if (activeDevice) {
          setVolume({ volumePercent })
        }
      }}
    />
  )
}

VolumeBarControlCell.fragments = {
  activeDevice: gql`
    fragment VolumeBarControlCell_activeDevice on Device {
      id
      volumePercent
    }
  `,
}

export default VolumeBarControlCell
