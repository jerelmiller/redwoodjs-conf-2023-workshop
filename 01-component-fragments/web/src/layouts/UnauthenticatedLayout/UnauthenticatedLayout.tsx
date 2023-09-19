import { Link, routes } from '@redwoodjs/router'

import Button from 'src/components/Button'
import ConferenceLogo from 'src/components/ConferenceLogo'
import RedwoodConfLogo from 'src/components/RedwoodConfLogo'
import RedwoodLogo from 'src/components/RedwoodLogo/RedwoodLogo'
import SidebarSection from 'src/components/SidebarSection'

type UnauthenticatedLayoutProps = {
  children?: React.ReactNode
}

const UnauthenticatedLayout = ({ children }: UnauthenticatedLayoutProps) => {
  return (
    <div
      className={
        'grid h-screen grid-cols-[375px_1fr] gap-2 p-2 [grid-template-areas:"sidebar_main-view"]'
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
          <SidebarSection className="p-4">
            <h3 className="font-semibold">Ready to get started?</h3>
            <p className="mt-2">
              Log in to make sure the setup completed successfully. Feel free to
              ask questions if you get stuck at this step.
            </p>
            <Button
              as="a"
              href="/login"
              variant="secondary"
              size="sm"
              className="mt-6"
            >
              Log in
            </Button>
          </SidebarSection>
        </nav>
      </aside>

      <main className="relative flex h-full flex-col overflow-hidden overflow-y-auto rounded-md bg-black-base text-primary [--main-content--padding:2rem] [--main-header--height:80px] [grid-area:main-view]">
        <article className="flex flex-1 flex-col">
          <header className="pointer-events-none absolute top-0 z-10 flex w-full flex-shrink-0 items-center justify-end bg-transparent px-[var(--main-content--padding)] pt-[var(--main-content--padding)] text-primary">
            <div className="pointer-events-auto flex items-center gap-4"></div>
          </header>
          {children}
        </article>
      </main>
    </div>
  )
}

export default UnauthenticatedLayout
