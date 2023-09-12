interface TrackNumberCellProps {
  trackNumber: number
}

const TrackNumberColumn = ({ trackNumber }: TrackNumberCellProps) => {
  return (
    <div className="flex min-w-[3ch] justify-end">
      <span className="tabular-nums text-muted">{trackNumber}</span>
    </div>
  )
}

export default TrackNumberColumn
