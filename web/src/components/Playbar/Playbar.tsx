import cx from 'classnames'
import {
  List,
  RepeatIcon,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
} from 'lucide-react'

import { Link, routes } from '@redwoodjs/router'

import CoverPhoto from 'src/components/CoverPhoto'
import DelimitedList from 'src/components/DelimitedList'
import Duration from 'src/components/Duration'
import LikeButton from 'src/components/LikeButton'
import PlaybarControlButton from 'src/components/PlaybarControlButton'
import PlayButton from 'src/components/PlayButton'
import ProgressBar from 'src/components/ProgressBar'

const TOOLTIP = {
  off: 'Enable repeat',
  context: 'Enable repeat one',
  track: 'Disable repeat',
} as const

const Playbar = () => {
  const playbackItem = {
    id: 'bogus',
    name: 'Track name',
    durationMs: 1000 * 60 * 4,
    artists: [{ id: '1', name: 'Bogus artist' }],
  }

  const playbackState = {
    isPlaying: false,
    progressMs: 1000 * 60,
    item: playbackItem,
  }

  const device = {
    volumePercent: 50,
    name: 'Your device',
  }

  const shuffled = false
  const repeatState = 'off' as const

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
              playing={playbackState?.isPlaying ?? false}
              variant="secondary"
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
              <Duration durationMs={playbackState.progressMs} />
            </span>
            <ProgressBar
              animate={false}
              max={playbackItem.durationMs}
              value={playbackState.progressMs}
              width="100%"
            />
            <span className="text-xs tabular-nums text-muted">
              <Duration durationMs={playbackItem.durationMs} />
            </span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <Link to="/queue" className="block leading-none">
            <PlaybarControlButton
              active={false}
              disallowed={false}
              tooltip="Queue"
            >
              <List strokeWidth={1.5} />
            </PlaybarControlButton>
          </Link>
          <span>devices</span>
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
        {/*
          <Flex justifyContent="end" gap="1rem" alignItems="center">
            <QueueControlButton />
            <DevicePopover devices={devices}>
              <PlaybarControlButton
                disallowed={devices.length === 0}
                icon={<DeviceIcon device={device} strokeWidth={1.5} />}
                tooltip="Connect to a device"
              />
            </DevicePopover>
          </Flex> */}
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

export default Playbar
