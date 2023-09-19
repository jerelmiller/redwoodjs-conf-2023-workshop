import TableCell from 'src/components/TableCell'

interface TrackNumberTableCellProps {
  position: number
}

const TrackNumberTableCell = ({ position }: TrackNumberTableCellProps) => {
  return (
    <TableCell shrink>
      <div className="flex min-w-[3ch] justify-end">
        <span className="tabular-nums text-muted">{position}</span>
      </div>
    </TableCell>
  )
}

export default TrackNumberTableCell
