import {
  PlaybackProgressBarCellQuery,
  PlaybackProgressBarCellQueryVariables,
} from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

import PlaybackProgressBar from 'src/components/PlaybackProgressBar'

export const QUERY = gql`
  query PlaybackProgressBarCellQuery {
    me {
      player {
        playbackState {
          isPlaying
          progressMs
          track {
            id
            durationMs
          }
        }
      }
    }
  }
`

export const Loading = () => {
  return <PlaybackProgressBar isPlaying={false} durationMs={0} progressMs={0} />
}

export const Success = ({
  me,
}: CellSuccessProps<
  PlaybackProgressBarCellQuery,
  PlaybackProgressBarCellQueryVariables
>) => {
  const playbackState = me.player.playbackState

  return (
    <PlaybackProgressBar
      isPlaying={playbackState?.isPlaying ?? false}
      durationMs={playbackState?.track?.durationMs ?? 0}
      progressMs={playbackState?.progressMs ?? 0}
    />
  )
}
