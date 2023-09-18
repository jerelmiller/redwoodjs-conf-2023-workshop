import cx from 'classnames'
import { List, Laptop2, Volume2, Volume1 } from 'lucide-react'
import type { PlaybarQuery, PlaybarQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import AnimatedSoundWave from 'src/components/AnimatedSoundWave'
import CoverPhoto from 'src/components/CoverPhoto'
import DelimitedList from 'src/components/DelimitedList'
import LikeButton from 'src/components/LikeButton'
import PlaybarControlButton from 'src/components/PlaybarControlButton'
import Popover from 'src/components/Popover'
import ProgressBar from 'src/components/ProgressBar'
import Skeleton from 'src/components/Skeleton'
import SkipToNextControl from 'src/components/SkipToNextControl'
import SkipToPreviousControl from 'src/components/SkipToPreviousControl'
import PlaybackProgressBarCell from 'src/workshop/components/PlaybackProgressBarCell'
import PlayControlCell from 'src/workshop/components/PlayControlCell'
import RepeatControlCell from 'src/workshop/components/RepeatControlCell'
import ShuffleControlCell from 'src/workshop/components/ShuffleControlCell'

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
    </div>
  </footer>
)

export const Empty = () => null

export const Failure = ({ error }: CellFailureProps<PlaybarQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  me,
}: CellSuccessProps<PlaybarQuery, PlaybarQueryVariables>) => {
  const playbackState = me.player.playbackState
  const isPlaying = playbackState?.isPlaying ?? false
  const currentTrack = playbackState?.track
  const coverPhoto = currentTrack?.album.images[0]

  const activeDevice = me.player.devices.find(
    (device) => device.id === playbackState?.device.id
  )
  const availableDevices = me.player.devices.filter(
    (device) => device.id !== playbackState?.device.id
  )

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
            <ShuffleControlCell />
            <SkipToPreviousControl />
            <PlayControlCell />
            <SkipToNextControl />
            <RepeatControlCell />
          </div>

          <PlaybackProgressBarCell />
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
              disabled={false}
              tooltip={activeDevice?.volumePercent === 0 ? 'Unmute' : 'Mute'}
            >
              <Volume2 />
            </PlaybarControlButton>
            <ProgressBar
              animate={false}
              value={activeDevice?.volumePercent ?? 0}
              max={100}
              width="100px"
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
