import { useEffect } from 'react'

import { useApolloClient } from '@apollo/client'

import Duration from '../Duration'
import ProgressBar from '../ProgressBar'

interface PlaybackProgressBarProps {
  isPlaying: boolean
  durationMs: number
  progressMs: number
  timestamp: number
}

const PLAYBACK_PROGRESS_FRAGMENT = gql`
  fragment PlaybackProgress on PlaybackState {
    timestamp
    progressMs
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
      const playbackState = client.readFragment({
        fragment: PLAYBACK_PROGRESS_FRAGMENT,
        id: client.cache.identify({ __typename: 'PlaybackState' }),
      })

      client.writeFragment({
        fragment: PLAYBACK_PROGRESS_FRAGMENT,
        id: client.cache.identify({ __typename: 'PlaybackState' }),
        data: {
          timestamp: Date.now(),
          progressMs:
            Date.now() - playbackState.timestamp + playbackState.progressMs,
        },
      })
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
