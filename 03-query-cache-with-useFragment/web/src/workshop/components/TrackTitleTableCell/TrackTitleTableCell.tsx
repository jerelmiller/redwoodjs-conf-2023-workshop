import { TrackTitleTableCell_track } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import CoverPhoto from 'src/components/CoverPhoto'
import DelimitedList from 'src/components/DelimitedList'
import ExplicitBadge from 'src/components/ExplicitBadge'
import TableCell from 'src/components/TableCell'

interface TrackTitleTableCellProps {
  includeCoverPhoto?: boolean
  track: TrackTitleTableCell_track
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
            {track.explicit && <ExplicitBadge />}
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

TrackTitleTableCell.fragments = {
  track: gql`
    fragment TrackTitleTableCell_track on Track {
      id
      explicit
      name
      album {
        images {
          url
        }
      }
      artists {
        id
        name
      }
    }
  `,
}

export default TrackTitleTableCell
