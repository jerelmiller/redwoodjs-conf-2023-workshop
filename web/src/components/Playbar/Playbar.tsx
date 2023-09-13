import { Link } from 'lucide-react'

import { routes } from '@redwoodjs/router'

import CoverPhoto from '../CoverPhoto'
import DelimitedList from '../DelimitedList'

const Playbar = () => {
  return (
    <footer className="flex flex-col [grid-area:playbar]">
      <div className="grid grid-cols-[30%_1fr_30%] items-center px-6 py-4 text-primary">
        <div className="flex items-center gap-4">
          <CoverPhoto size="4rem" image={undefined} />
          <div className="flex flex-col gap-1">
            <Link className="text-sm" to={routes.album({ id: 'bogus' })}>
              Track name
            </Link>
            <span className="text-xs text-muted">
              <DelimitedList className="text-xs text-muted" delimiter=", ">
                {{ artists: [{ id: '1', name: 'Bogus name' }] }.artists.map(
                  (artist) => (
                    <Link key={artist.id} to={routes.artist({ id: artist.id })}>
                      {artist.name}
                    </Link>
                  )
                )}
              </DelimitedList>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-5">
            <span>shuffle</span>
            <span>backward</span>
            <span>play</span>
            <span>forward</span>
            <span>repeat</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <span>queue</span>
          <span>devices</span>
          <div className="flex items-center gap-1">
            <span>mute</span>
            <span>volume bar</span>
          </div>
        </div>
        {/* <Flex gap="1rem" alignItems="center">
            <CoverPhoto size="4rem" image={coverPhoto} />
            {playbackItem?.__typename === 'Track' ? (
            ) : playbackItem?.__typename === 'Episode' ? (
              <EpisodePlaybackDetails episode={playbackItem} />
            ) : null}
            {playbackState && (
              <LikeControl playbackItem={playbackItem} size="1.25rem" />
            )}
          </Flex>
          <Flex direction="column" gap="0.5rem">
            <Flex alignItems="center" gap="1.25rem" justifyContent="center">
              {playbackItem?.__typename === 'Track' && (
                <ShufflePlaybackControl
                  shuffled={playbackState?.shuffleState ?? false}
                  disallowed={disallowed(Action.TogglingShuffle)}
                  size="1.25rem"
                />
              )}
              {playbackItem?.__typename === 'Episode' && (
                <SkipBackwardControl
                  ms={EPISODE_SKIP_FORWARD_AMOUNT}
                  progressMs={playbackState?.progressMs ?? 0}
                />
              )}
              <SkipToPreviousControl
                disallowed={disallowed(Action.SkippingPrev)}
                progressMs={playbackState?.progressMs ?? 0}
              />
              <PlayButton
                disabled={!device}
                size="2.5rem"
                playing={playbackState?.isPlaying ?? false}
                onPlay={() => resumePlayback()}
              />
              <SkipToNextControl disallowed={disallowed(Action.SkippingNext)} />
              {playbackItem?.__typename === 'Episode' && (
                <SkipForwardControl
                  ms={EPISODE_SKIP_FORWARD_AMOUNT}
                  progressMs={playbackState?.progressMs ?? 0}
                />
              )}
              {playbackItem?.__typename === 'Track' && (
                <RepeatControl
                  disallowed={disallowed(Action.TogglingRepeatTrack)}
                  repeatState={playbackState?.repeatState ?? RepeatMode.Off}
                />
              )}
            </Flex>
            <PlaybackItemProgressBar playbackState={playbackState} />
          </Flex>
          <Flex justifyContent="end" gap="1rem" alignItems="center">
            <QueueControlButton />
            <DevicePopover devices={devices}>
              <PlaybarControlButton
                disallowed={devices.length === 0}
                icon={<DeviceIcon device={device} strokeWidth={1.5} />}
                tooltip="Connect to a device"
              />
            </DevicePopover>
            <Flex gap="0.25rem" alignItems="center">
              <MuteControl
                disallowed={!device}
                volumePercent={device?.volumePercent ?? 0}
              />
              <VolumeBar
                volumePercent={device?.volumePercent ?? 0}
                width="100px"
              />
            </Flex>
          </Flex> */}
      </div>
      {/* device && (
          <Flex
            alignItems="center"
            className={cx(
              'before:[--arrow-size:0.625rem]',
              'border-solid before:border-b-green before:border-l-transparent before:border-r-transparent before:[border-bottom-width:var(--arrow-size)] before:[border-left-width:var(--arrow-size)] before:[border-right-width:var(--arrow-size)]',
              'relative rounded bg-green px-6 py-1 text-sm leading-none',
              'pointer-events-none before:absolute before:right-[10.5rem] before:top-0 before:-translate-y-full'
            )}
            justifyContent="end"
          >
            <Volume1 size="1.125rem" /> Listening on {device.name}
          </Flex>
        ) */}
    </footer>
  )
}

export default Playbar
