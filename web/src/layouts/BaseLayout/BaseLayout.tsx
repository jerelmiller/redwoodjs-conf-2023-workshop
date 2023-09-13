import { Home, Library, Pin } from 'lucide-react'

import { Link, routes } from '@redwoodjs/router'

import ApolloLogo from 'src/components/ApolloLogo'
import CoverPhoto from 'src/components/CoverPhoto'
import CurrentUserMenuCell from 'src/components/CurrentUserMenuCell'
import DelimitedList from 'src/components/DelimitedList'
import LikedTracksCoverPhoto from 'src/components/LikedTracksCoverPhoto/LikedTracksCoverPhoto'
import ScrollableList from 'src/components/ScrollableList'
import SidebarNavLink from 'src/components/SidebarNavLink'
import SidebarPlaylistContent from 'src/components/SidebarPlaylistContent/SidebarPlaylistContent'
import SidebarPlaylistLink from 'src/components/SidebarPlaylistLink/SidebarPlaylistLink'
import SidebarPlaylistName from 'src/components/SidebarPlaylistName'
import SidebarPlaylistsCell from 'src/components/SidebarPlaylistsCell'
import SidebarSection from 'src/components/SidebarSection'

type BaseLayoutProps = {
  children?: React.ReactNode
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div
      className={
        'grid h-screen grid-cols-[375px_1fr] gap-2 p-2 [grid-template-areas:"sidebar_main-view""playbar_playbar"] [grid-template-rows:1fr_auto]'
      }
    >
      <aside className="overflow-auto pb-0 pt-4 text-primary [grid-area:sidebar]">
        <nav className="flex h-full flex-col">
          <Link to={routes.home()} className="-left-3 flex justify-center py-2">
            <ApolloLogo size="225px" className="relative -left-3" />
          </Link>
          <SidebarSection className="px-4 py-2">
            <SidebarNavLink to={routes.home()}>
              <Home size="1.5rem" />
              Home
            </SidebarNavLink>
          </SidebarSection>
          <SidebarSection className="flex flex-1 flex-col overflow-hidden pb-0">
            <header className="px-4 py-2">
              <h2 className="flex items-center gap-2 py-2 text-base text-muted">
                <Library /> Your Library
              </h2>
            </header>
            <ScrollableList as="ul" className="-mx-1 flex-1 px-3">
              <SidebarPlaylistLink to={routes.likedTracks()}>
                <LikedTracksCoverPhoto iconSize="1rem" size="48px" />
                <SidebarPlaylistContent>
                  <SidebarPlaylistName>Liked Songs</SidebarPlaylistName>
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
              </SidebarPlaylistLink>

              <SidebarPlaylistsCell />
            </ScrollableList>
          </SidebarSection>
        </nav>
      </aside>
      <main className="relative flex h-full flex-col overflow-hidden overflow-y-auto rounded-md bg-black-base text-primary [--main-content--padding:2rem] [--main-header--height:80px] [grid-area:main-view]">
        <ScrollableList as="article" className="flex flex-1 flex-col">
          <header className="pointer-events-none absolute top-0 z-10 flex w-full flex-shrink-0 items-center justify-end bg-transparent px-[var(--main-content--padding)] pt-[var(--main-content--padding)] text-primary">
            <div className="pointer-events-auto flex items-center gap-4">
              <CurrentUserMenuCell />
            </div>
          </header>
          {children}
        </ScrollableList>
      </main>
      <footer className="flex flex-col [grid-area:playbar]">
        <div className="grid grid-cols-[30%_1fr_30%] items-center px-6 py-4 text-primary">
          <div className="flex items-center gap-4">
            <CoverPhoto size="4rem" image={undefined} />
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
              <TrackPlaybackDetails
                context={playbackState?.context ?? null}
                track={playbackItem}
              />
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
    </div>
  )
}

export default BaseLayout
