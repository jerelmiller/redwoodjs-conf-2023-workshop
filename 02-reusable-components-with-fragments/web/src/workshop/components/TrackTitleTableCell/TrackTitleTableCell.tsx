import { Link, routes } from '@redwoodjs/router'

import CoverPhoto from 'src/components/CoverPhoto'
import DelimitedList from 'src/components/DelimitedList'
// Use the ExplicitBadge component to mark the track as explicit
// import ExplicitBadge from 'src/components/ExplicitBadge'
import TableCell from 'src/components/TableCell'

interface Track {
  name: string
  album?: {
    images: Array<{ url: string }>
  }
  artists: Array<{ id: string; name: string }>
}

interface TrackTitleTableCellProps {
  includeCoverPhoto?: boolean
  track: Track
}

const TrackTitleTableCell = ({
  includeCoverPhoto = true,
  track,
}: TrackTitleTableCellProps) => {
  return (
    <TableCell>
      <div className="flex items-end gap-2">
        {includeCoverPhoto && (
          <CoverPhoto
            className="flex-shrink-0"
            image={track.album?.images.at(-1)}
            size="2.5rem"
          />
        )}
        <div className="flex flex-col">
          <span className="line-clamp-1 text-base text-primary">
            {track.name}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-muted">
              <DelimitedList delimiter=", ">
                {track.artists.map((artist) => (
                  <Link
                    key={artist.id}
                    className="transition-colors duration-150 hover:text-primary"
                    to={routes.artist({ id: artist.id })}
                  >
                    {artist.name}
                  </Link>
                ))}
              </DelimitedList>
            </span>
          </div>
        </div>
      </div>
    </TableCell>
  )
}

export default TrackTitleTableCell
