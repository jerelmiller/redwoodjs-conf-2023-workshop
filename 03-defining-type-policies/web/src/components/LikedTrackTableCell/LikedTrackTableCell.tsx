import cx from 'classnames'

import TableCell from 'src/components/TableCell'
import { useRemoveSavedTrackMutation } from 'src/mutations/useRemoveSavedTrackMutation'
import { useSaveTrackMutation } from 'src/mutations/useSaveTrackMutation'

import LikeButton from '../LikeButton'

interface Track {
  id: string
}

interface LikedTrackTableCellProps {
  track: Track
  liked: boolean
}

const LikedTrackTableCell = ({ track, liked }: LikedTrackTableCellProps) => {
  const saveTrack = useSaveTrackMutation()
  const removeSavedTrack = useRemoveSavedTrackMutation()

  return (
    <TableCell shrink>
      <div className="px-2">
        <LikeButton
          liked={liked}
          size="1rem"
          className={cx('relative top-[2px] group-hover:visible', {
            invisible: !liked,
          })}
          onClick={() => {
            if (liked) {
              removeSavedTrack({ id: track.id })
            } else {
              saveTrack({ id: track.id })
            }
          }}
        />
      </div>
    </TableCell>
  )
}

export default LikedTrackTableCell
