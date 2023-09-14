import {
  Shuffle,
  SkipBack,
  SkipForward,
  RepeatIcon,
  List,
  Laptop2,
  Volume2,
  Volume1,
} from 'lucide-react'
import cx from 'classnames'
import type { PlaybarQuery, PlaybarQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { usePausePlaybackMutation } from 'src/mutations/usePausePlaybackMutation'
import { useResumePlaybackMutation } from 'src/mutations/useResumePlaybackMutation'

import AnimatedSoundWave from '../AnimatedSoundWave'
import CoverPhoto from '../CoverPhoto'
import DelimitedList from '../DelimitedList'
import Duration from '../Duration'
import LikeButton from '../LikeButton'
import PlaybarControlButton from '../PlaybarControlButton'
import PlayButton from '../PlayButton'
import Popover from '../Popover'
import ProgressBar from '../ProgressBar'

export const QUERY = gql`
  query PlaybarQuery {
    me {
      player {
        playbackState {
          isPlaying
        }
      }
    }
  }
`

const TOOLTIP = {
  off: 'Enable repeat',
  context: 'Enable repeat one',
  track: 'Disable repeat',
} as const

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps<PlaybarQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  me,
}: CellSuccessProps<PlaybarQuery, PlaybarQueryVariables>) => {
  const playbackState = me.player.playbackState
  const resumePlayback = useResumePlaybackMutation()
  const pausePlayback = usePausePlaybackMutation()
  const isPlaying = playbackState?.isPlaying ?? false

  const playbackItem = {
    id: 'bogus',
    name: 'Track name',
    durationMs: 1000 * 60 * 4,
    artists: [{ id: '1', name: 'Bogus artist' }],
  }

  const device = {
    id: 'bogus',
    volumePercent: 50,
    name: 'Your device',
  }

  const shuffled = false
  const repeatState = 'off' as const
  const availableDevices: Array<typeof device> = []

  return (
    <footer className="flex flex-col [grid-area:playbar]">
      <div className="grid grid-cols-[30%_1fr_30%] items-center px-6 py-4 text-primary">
        <div className="flex items-center gap-4">
          <CoverPhoto size="4rem" image={undefined} />
          <div className="flex flex-col gap-1">
            <Link
              className="text-sm"
              to={routes.album({ id: playbackItem.id })}
            >
              Track name
            </Link>
            <span className="text-xs text-muted">
              <DelimitedList className="text-xs text-muted" delimiter=", ">
                {playbackItem.artists.map((artist) => (
                  <Link key={artist.id} to={routes.artist({ id: artist.id })}>
                    {artist.name}
                  </Link>
                ))}
              </DelimitedList>
            </span>
          </div>
          <LikeButton liked={false} size="1.25rem" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-5">
            <PlaybarControlButton
              active={shuffled}
              disallowed={false}
              tooltip={shuffled ? 'Disable shuffle' : 'Enable shuffle'}
            >
              <Shuffle size="1.25rem" />
            </PlaybarControlButton>
            <PlaybarControlButton disallowed={false} tooltip="Previous">
              <SkipBack fill="currentColor" />
            </PlaybarControlButton>
            <PlayButton
              disabled={false}
              size="2.5rem"
              playing={isPlaying}
              variant="secondary"
              onClick={() => {
                isPlaying ? pausePlayback() : resumePlayback()
              }}
            />
            <PlaybarControlButton disallowed={false} tooltip="Next">
              <SkipForward fill="currentColor" />
            </PlaybarControlButton>
            <PlaybarControlButton
              active={repeatState !== 'off'}
              disallowed={false}
              tooltip={TOOLTIP[repeatState]}
            >
              <RepeatIcon />
            </PlaybarControlButton>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs tabular-nums text-muted">
              <Duration durationMs={1000 * 60} />
            </span>
            <ProgressBar
              animate={false}
              max={playbackItem.durationMs}
              value={1000 * 60}
              width="100%"
            />
            <span className="text-xs tabular-nums text-muted">
              <Duration durationMs={playbackItem.durationMs} />
            </span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <Link
            to=""
            className="block leading-none"
            onClick={() =>
              console.warn(
                'Queue page is not implemented and therefore a noop.'
              )
            }
          >
            <PlaybarControlButton
              active={false}
              disallowed={false}
              tooltip="Queue"
            >
              <List strokeWidth={1.5} />
            </PlaybarControlButton>
          </Link>

          <Popover
            content={
              <div>
                {device && (
                  <div className="flex items-center gap-4 p-4">
                    {playbackState?.isPlaying ? (
                      <AnimatedSoundWave size="1.5rem" />
                    ) : (
                      <Laptop2 size="1.5rem" className="text-green" />
                    )}
                    <div className="flex flex-col">
                      <h3 className="text-base font-bold">Current device</h3>
                      <span className="text-sm text-green-light">
                        {device.name}
                      </span>
                    </div>
                  </div>
                )}
                {availableDevices.length > 0 && (
                  <h4 className="my-2 px-4">Select another device</h4>
                )}
                <ul className="flex list-none flex-col">
                  {availableDevices.map((device) => (
                    <li key={device.id}>
                      <button className="flex w-full cursor-pointer items-center gap-4 rounded p-4 text-sm hover:bg-white/10">
                        <Laptop2 strokeWidth={1.5} />
                        {device.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            }
          >
            <PlaybarControlButton
              disallowed={false}
              tooltip="Connect to a device"
            >
              <Laptop2 strokeWidth={1.5} />
            </PlaybarControlButton>
          </Popover>
          <div className="flex items-center gap-1">
            <PlaybarControlButton
              disallowed={false}
              tooltip={device.volumePercent === 0 ? 'Unmute' : 'Mute'}
            >
              <Volume2 />
            </PlaybarControlButton>
            <ProgressBar
              animate={false}
              value={device.volumePercent}
              max={100}
              width="100px"
            />
          </div>
        </div>
      </div>
      {device && (
        <div
          className={cx(
            'flex items-center justify-end',
            'before:[--arrow-size:0.625rem]',
            'border-solid before:border-b-green before:border-l-transparent before:border-r-transparent before:[border-bottom-width:var(--arrow-size)] before:[border-left-width:var(--arrow-size)] before:[border-right-width:var(--arrow-size)]',
            'relative rounded bg-green px-6 py-1 text-sm leading-none',
            'pointer-events-none before:absolute before:right-[10.5rem] before:top-0 before:-translate-y-full'
          )}
        >
          <Volume1 size="1.125rem" /> Listening on {device.name}
        </div>
      )}
    </footer>
  )
}
