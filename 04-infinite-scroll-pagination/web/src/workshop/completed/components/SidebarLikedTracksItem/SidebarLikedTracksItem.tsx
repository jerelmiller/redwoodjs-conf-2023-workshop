import { TypedDocumentNode, useFragment } from '@apollo/client'
import { Pin, Volume2 } from 'lucide-react'
import { SidebarLikedTracksItem_playbackState } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import DelimitedList from 'src/components/DelimitedList'
import LikedTracksCoverPhoto from 'src/components/LikedTracksCoverPhoto'
import SidebarPlaylistContent from 'src/components/SidebarPlaylistContent'
import SidebarPlaylistLink from 'src/components/SidebarPlaylistLink'
import SidebarPlaylistName from 'src/components/SidebarPlaylistName'

const PLAYBACK_STATE_FRAGMENT: TypedDocumentNode<SidebarLikedTracksItem_playbackState> = gql`
  fragment SidebarLikedTracksItem_playbackState on PlaybackState {
    isPlaying
    context {
      uri
    }
  }
`

const SidebarLikedTracksItem = () => {
  const { data: playbackState } = useFragment({
    fragment: PLAYBACK_STATE_FRAGMENT,
    from: { __typename: 'PlaybackState' },
  })

  const isPlaying = playbackState.isPlaying ?? false
  const isCurrentContext = playbackState.context?.uri === 'collection:tracks'

  return (
    <SidebarPlaylistLink to={routes.likedTracks()}>
      <LikedTracksCoverPhoto iconSize="1rem" size="48px" />
      <SidebarPlaylistContent>
        <SidebarPlaylistName isCurrentContext={isCurrentContext}>
          Liked Songs
        </SidebarPlaylistName>
        <div className="flex items-center gap-2">
          <Pin
            fill="currentColor"
            size="1rem"
            strokeWidth={1}
            className="rotate-45 text-theme-light"
          />
          <span className="text-sm text-muted">
            <DelimitedList delimiter=" · ">
              <span>Playlist</span>
              <span>Spotify</span>
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

export default SidebarLikedTracksItem
