import Markdown from 'react-markdown'
import { ComponentPropsWithoutRef } from 'react-markdown/lib/ast-to-react'

import readme from 'src/README.md?raw'

type MarkdownProps = ComponentPropsWithoutRef<typeof Markdown>

const HomePageInstructions = () => {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col py-[var(--main-content--padding)]">
      <Markdown components={components}>{readme}</Markdown>
    </div>
  )
}

const components: MarkdownProps['components'] = {
  h1: ({ children }) => <h1 className="text-6xl">{children}</h1>,
  h2: ({ children }) => <h1 className="text-4xl">{children}</h1>,
  p: ({ children }) => <p className="text-xl">{children}</p>,
}

export default HomePageInstructions
