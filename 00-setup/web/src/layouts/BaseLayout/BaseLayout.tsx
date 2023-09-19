import { Home, Library, Pin } from 'lucide-react'

import { Link, routes } from '@redwoodjs/router'

import ConferenceLogo from 'src/components/ConferenceLogo/ConferenceLogo'
import CurrentUserMenuCell from 'src/components/CurrentUserMenuCell'
import DelimitedList from 'src/components/DelimitedList'
import LikedTracksCoverPhoto from 'src/components/LikedTracksCoverPhoto/LikedTracksCoverPhoto'
import NotificationManager from 'src/components/NotificationManager/NotificationManager'
import PlaybarCell from 'src/components/PlaybarCell'
import RedwoodConfLogo from 'src/components/RedwoodConfLogo/RedwoodConfLogo'
import RedwoodLogo from 'src/components/RedwoodLogo/RedwoodLogo'
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
      <aside className="overflow-auto pb-0 pt-0 text-primary [grid-area:sidebar]">
        <nav className="flex h-full flex-col">
          <Link
            to={routes.home()}
            className="flex items-center gap-2 py-2 pl-4 hover:no-underline"
          >
            <RedwoodLogo size="70px" />
            <div className="flex flex-col">
              <RedwoodConfLogo width="200" />
              <ConferenceLogo width="200" />
            </div>
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
                  <SidebarPlaylistName isCurrentContext={false}>
                    Liked Songs
                  </SidebarPlaylistName>
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
            <div className="pointer-events-auto relative -top-3 flex items-center gap-4">
              <CurrentUserMenuCell />
            </div>
          </header>
          {children}
        </ScrollableList>
      </main>

      <PlaybarCell />
      <NotificationManager />
    </div>
  )
}

export default BaseLayout
