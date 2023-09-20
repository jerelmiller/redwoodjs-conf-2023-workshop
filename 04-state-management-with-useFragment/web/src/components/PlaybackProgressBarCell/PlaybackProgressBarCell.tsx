import { PlaybackProgressBarCell_playbackState } from 'types/graphql'

import PlaybackProgressBar from 'src/components/PlaybackProgressBar'

interface PlaybackProgressBarProps {
  playbackState: PlaybackProgressBarCell_playbackState | null | undefined
}

const PlaybackProgressBarCell = ({
  playbackState,
}: PlaybackProgressBarProps) => {
  return (
    <PlaybackProgressBar
      isPlaying={playbackState?.isPlaying ?? false}
      durationMs={playbackState?.track?.durationMs ?? 0}
      progressMs={playbackState?.progressMs ?? 0}
      timestamp={playbackState?.timestamp}
    />
  )
}

PlaybackProgressBarCell.fragments = {
  playbackState: gql`
    fragment PlaybackProgressBarCell_playbackState on PlaybackState {
      isPlaying
      progressMs
      timestamp
      track {
        id
        durationMs
      }
    }
  `,
}

export default PlaybackProgressBarCell
