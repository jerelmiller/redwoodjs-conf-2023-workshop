import cx from 'classnames'
import {
  SkipBack,
  SkipForward,
  List,
  Laptop2,
  Volume2,
  Volume1,
} from 'lucide-react'
import type { PlaybarQuery, PlaybarQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { usePausePlaybackMutation } from 'src/mutations/usePausePlaybackMutation'
import { useResumePlaybackMutation } from 'src/mutations/useResumePlaybackMutation'
import { useSetVolumeMutation } from 'src/mutations/useSetVolumeMutation'

import AnimatedSoundWave from '../AnimatedSoundWave'
import CoverPhoto from '../CoverPhoto'
import DelimitedList from '../DelimitedList'
import LikeButton from '../LikeButton'
import PlaybackProgressBar from '../PlaybackProgressBar'
import PlaybarControlButton from '../PlaybarControlButton'
import PlayButton from '../PlayButton'
import Popover from '../Popover'
import ProgressBar from '../ProgressBar'
import RepeatControl from '../RepeatControl/RepeatControl'
import ShuffleControl from '../ShuffleControl/ShuffleControl'
import Skeleton from '../Skeleton'

export const QUERY = gql`
  query PlaybarQuery {
    me {
      player {
        devices {
          id
          name
          type
          volumePercent
        }
        playbackState {
          isPlaying
          shuffleState
          repeatState
          progressMs
          timestamp
          context {
            uri
          }
          device {
            id
          }
          track {
            id
            name
            durationMs
            album {
              id
              images {
                url
              }
            }
            artists {
              id
              name
            }
          }
        }
      }
    }
  }
`

export const Loading = () => (
  <footer className="flex flex-col [grid-area:playbar]">
    <div className="grid grid-cols-[30%_1fr_30%] items-center px-6 py-5 text-primary">
      <div className="flex items-center gap-4">
        <Skeleton.CoverPhoto size="4rem" />
        <div className="flex flex-col gap-2">
          <Skeleton.Text width="4rem" />
          <Skeleton.Text width="8rem" />
        </div>
        <LikeButton disabled liked={false} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-5">
          <ShuffleControl disabled shuffled={false} />
          <PlaybarControlButton disabled tooltip="Previous">
            <SkipBack fill="currentColor" />
          </PlaybarControlButton>
          <PlayButton
            disabled
            playing={false}
            size="2.5rem"
            variant="secondary"
          />
          <PlaybarControlButton disabled tooltip="Next">
            <SkipForward fill="currentColor" />
          </PlaybarControlButton>
          <RepeatControl disabled repeatState="OFF" />
        </div>
        <PlaybackProgressBar durationMs={0} progressMs={0} isPlaying={false} />
      </div>
      <div className="flex items-center justify-end gap-4">
        <PlaybarControlButton active={false} disabled tooltip="Queue">
          <List strokeWidth={1.5} />
        </PlaybarControlButton>
        <PlaybarControlButton disabled tooltip="Connect to a device">
          <Laptop2 strokeWidth={1.5} />
        </PlaybarControlButton>
        <div className="flex items-center gap-2">
          <PlaybarControlButton disabled tooltip="Mute">
            <Volume2 />
          </PlaybarControlButton>
          <ProgressBar animate={false} value={100} max={100} width="100px" />
        </div>
      </div>
    </div>
  </footer>
)

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
  const setVolume = useSetVolumeMutation()
  const isPlaying = playbackState?.isPlaying ?? false
  const currentTrack = playbackState?.track
  const coverPhoto = currentTrack?.album.images[0]

  const activeDevice = me.player.devices.find(
    (device) => device.id === playbackState?.device.id
  )
  const availableDevices = me.player.devices.filter(
    (device) => device.id !== playbackState?.device.id
  )

  const shuffled = playbackState?.shuffleState ?? false
  const repeatState = playbackState?.repeatState ?? 'OFF'

  return (
    <footer className="flex flex-col [grid-area:playbar]">
      <div className="grid grid-cols-[30%_1fr_30%] items-center px-6 py-4 text-primary">
        <div className="flex items-center gap-4">
          <CoverPhoto size="4rem" image={coverPhoto} />
          {currentTrack && (
            <>
              <div className="flex flex-col gap-1">
                <Link
                  className="text-sm"
                  to={routes.album({ id: currentTrack.album.id })}
                >
                  {currentTrack.name}
                </Link>
                <span className="text-xs text-muted">
                  <DelimitedList className="text-xs text-muted" delimiter=", ">
                    {currentTrack.artists.map((artist) => (
                      <Link
                        key={artist.id}
                        to={routes.artist({ id: artist.id })}
                      >
                        {artist.name}
                      </Link>
                    ))}
                  </DelimitedList>
                </span>
              </div>
              <LikeButton liked={false} size="1.25rem" />
            </>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-5">
            <ShuffleControl shuffled={shuffled} />
            <PlaybarControlButton disabled tooltip="Previous">
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
            <PlaybarControlButton disabled tooltip="Next">
              <SkipForward fill="currentColor" />
            </PlaybarControlButton>
            <RepeatControl repeatState={repeatState} />
          </div>

          <PlaybackProgressBar
            isPlaying={isPlaying}
            durationMs={currentTrack?.durationMs ?? 0}
            progressMs={playbackState?.progressMs ?? 0}
          />
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
              disabled={false}
              tooltip="Queue"
            >
              <List strokeWidth={1.5} />
            </PlaybarControlButton>
          </Link>

          <Popover
            content={
              <div>
                {activeDevice && (
                  <div className="flex items-center gap-4 p-4">
                    {isPlaying ? (
                      <AnimatedSoundWave size="1.5rem" />
                    ) : (
                      <Laptop2 size="1.5rem" className="text-green" />
                    )}
                    <div className="flex flex-col">
                      <h3 className="text-base font-bold">Current device</h3>
                      <span className="text-sm text-green-light">
                        {activeDevice.name}
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
              disabled={false}
              tooltip="Connect to a device"
            >
              <Laptop2 strokeWidth={1.5} />
            </PlaybarControlButton>
          </Popover>
          <div className="flex items-center gap-1">
            <PlaybarControlButton
              disabled={!activeDevice}
              tooltip={activeDevice?.volumePercent === 0 ? 'Unmute' : 'Mute'}
              onClick={() => {
                if (activeDevice) {
                  setVolume({
                    volumePercent: activeDevice.volumePercent === 0 ? 100 : 0,
                  })
                }
              }}
            >
              <Volume2 />
            </PlaybarControlButton>
            <ProgressBar
              animate={false}
              value={activeDevice?.volumePercent ?? 0}
              max={100}
              width="100px"
              onChange={(volumePercent) => {
                if (activeDevice) {
                  setVolume({ volumePercent })
                }
              }}
            />
          </div>
        </div>
      </div>
      {activeDevice && (
        <div
          className={cx(
            'flex items-center justify-end',
            'before:[--arrow-size:0.625rem]',
            'border-solid before:border-b-green before:border-l-transparent before:border-r-transparent before:[border-bottom-width:var(--arrow-size)] before:[border-left-width:var(--arrow-size)] before:[border-right-width:var(--arrow-size)]',
            'relative rounded bg-green px-6 py-1 text-sm leading-none',
            'pointer-events-none before:absolute before:right-[10.5rem] before:top-0 before:-translate-y-full'
          )}
        >
          <Volume1 size="1.125rem" /> Listening on {activeDevice.name}
        </div>
      )}
    </footer>
  )
}
