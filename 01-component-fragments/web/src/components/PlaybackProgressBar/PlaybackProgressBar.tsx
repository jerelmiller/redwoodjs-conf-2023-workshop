import { useEffect } from 'react'

import { TypedDocumentNode, useApolloClient } from '@apollo/client'
import { PlaybackProgressCacheQuery } from 'types/graphql'

import Duration from '../Duration'
import ProgressBar from '../ProgressBar'

interface PlaybackProgressBarProps {
  isPlaying: boolean
  durationMs: number
  progressMs: number
  timestamp: number
}

const PLAYBACK_PROGRESS_QUERY: TypedDocumentNode<PlaybackProgressCacheQuery> = gql`
  query PlaybackProgressCacheQuery {
    me {
      player {
        playbackState {
          timestamp
          progressMs
        }
      }
    }
  }
`

const PlaybackProgressBar = ({
  isPlaying,
  durationMs,
  progressMs,
  // Not actually consumed in this component, but needed for the workshop to
  // ensure we can read the fragment from the cache and simulate time passing
  timestamp: _timestamp,
}: PlaybackProgressBarProps) => {
  const client = useApolloClient()

  useEffect(() => {
    if (!isPlaying) {
      return
    }

    const id = setInterval(() => {
      const data = client.readQuery({
        query: PLAYBACK_PROGRESS_QUERY,
      })

      const playbackState = data?.me?.player.playbackState

      if (playbackState) {
        client.writeQuery({
          query: PLAYBACK_PROGRESS_QUERY,
          data: {
            me: {
              __typename: 'CurrentUser',
              player: {
                __typename: 'Player',
                playbackState: {
                  __typename: 'PlaybackState',
                  timestamp: Date.now(),
                  progressMs:
                    Date.now() -
                    playbackState.timestamp +
                    (playbackState.progressMs ?? 0),
                },
              },
            },
          },
        })
      }
    }, 1000)

    return () => clearInterval(id)
  }, [client, isPlaying])

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs tabular-nums text-muted">
        <Duration durationMs={Math.min(progressMs, durationMs)} />
      </span>
      <ProgressBar
        animate={false}
        max={durationMs}
        value={Math.min(progressMs, durationMs)}
        width="100%"
      />
      <span className="text-xs tabular-nums text-muted">
        <Duration durationMs={durationMs} />
      </span>
    </div>
  )
}

export default PlaybackProgressBar
