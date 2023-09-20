import { Volume2 } from 'lucide-react'
import { SidebarPlaylistItem_playlist } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import CoverPhoto from '../CoverPhoto'
import DelimitedList from '../DelimitedList'
import SidebarPlaylistContent from '../SidebarPlaylistContent'
import SidebarPlaylistLink from '../SidebarPlaylistLink'
import SidebarPlaylistName from '../SidebarPlaylistName'

interface SidebarPlaylistItemProps {
  playlist: SidebarPlaylistItem_playlist
}

const SidebarPlaylistItem = ({ playlist }: SidebarPlaylistItemProps) => {
  const isCurrentContext = false
  const isPlaying = false

  return (
    <SidebarPlaylistLink to={routes.playlist({ id: playlist.id })}>
      <CoverPhoto image={playlist.images.at(-1)} size="48px" />
      <SidebarPlaylistContent>
        <SidebarPlaylistName isCurrentContext={isCurrentContext}>
          {playlist.name}
        </SidebarPlaylistName>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">
            <DelimitedList delimiter=" · ">
              <span>Playlist</span>
              <span>{playlist.owner.displayName}</span>
            </DelimitedList>
          </span>
        </div>
      </SidebarPlaylistContent>
      {isCurrentContext && isPlaying && (
        <Volume2 color="var(--color--theme--light)" size="0.875rem" />
      )}
    </SidebarPlaylistLink>
  )
}

SidebarPlaylistItem.fragments = {
  playlist: gql`
    fragment SidebarPlaylistItem_playlist on Playlist {
      id
      name
      images {
        url
      }
      owner {
        id
        displayName
      }
    }
  `,
}

export default SidebarPlaylistItem
