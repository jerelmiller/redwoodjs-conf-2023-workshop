import AnimatedSoundWave from 'src/components/AnimatedSoundWave'
import TableCell from 'src/components/TableCell'

interface TrackNumberTableCellProps {
  position: number
  trackId: string
}

const TrackNumberTableCell = ({
  position,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trackId,
}: TrackNumberTableCellProps) => {
  const isPlaying = false
  const isCurrentTrack = false
  const isCurrentlyPlaying = isCurrentTrack && isPlaying

  return (
    <TableCell shrink>
      <div className="flex min-w-[3ch] justify-end">
        <span className="tabular-nums text-muted">
          {isCurrentlyPlaying ? <AnimatedSoundWave /> : position}
        </span>
      </div>
    </TableCell>
  )
}

export default TrackNumberTableCell
