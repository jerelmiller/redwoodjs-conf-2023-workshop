interface TrackNumberCellProps {
  position: number
}

const TrackNumberCell = ({ position }: TrackNumberCellProps) => {
  return (
    <div className="flex min-w-[3ch] justify-end">
      <span className="tabular-nums text-muted">{position}</span>
    </div>
  )
}

export default TrackNumberCell
