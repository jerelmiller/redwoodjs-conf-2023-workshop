import { Link, routes } from '@redwoodjs/router'
import cx from 'classnames'
import { Home, Library, Scroll, Search } from 'lucide-react'
import { useRef } from 'react'
import ApolloLogo from 'src/components/ApolloLogo'
import ScrollableList from 'src/components/ScrollableList'
import SidebarNavLink from 'src/components/SidebarNavLink'
import SidebarSection from 'src/components/SidebarSection'
import SidebarPlaylistsCell from 'src/components/SidebarPlaylistsCell'

type BaseLayoutProps = {
  children?: React.ReactNode
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={
        'grid h-screen grid-cols-[375px_1fr] gap-2 p-2 [grid-template-areas:"sidebar_main-view""playbar_playbar"] [grid-template-rows:1fr_auto]'
      }
    >
      <aside className="overflow-auto pb-0 pt-4 text-primary [grid-area:sidebar]">
        <nav className="flex h-full flex-col">
          <Link to={routes.home()} className="-left-3 flex justify-center">
            <ApolloLogo size="225px" className="relative -left-3" />
          </Link>
          <SidebarSection className="px-4 py-2">
            <SidebarNavLink to={routes.home()} icon={<Home size="1.5rem" />}>
              Home
            </SidebarNavLink>
            <SidebarNavLink to={routes.home()} icon={<Search size="1.5rem" />}>
              Search
            </SidebarNavLink>
          </SidebarSection>
          <SidebarSection className="flex flex-1 flex-col overflow-hidden pb-0">
            <header className="px-4 py-2">
              <h2 className="flex items-center gap-2 py-2 text-base text-muted">
                <Library /> Your Library
              </h2>
            </header>
            <ScrollableList className="-mx-1 px-3">
              <SidebarPlaylistsCell />
            </ScrollableList>
          </SidebarSection>
        </nav>
      </aside>
      {children}
    </div>
  )
}

export default BaseLayout
