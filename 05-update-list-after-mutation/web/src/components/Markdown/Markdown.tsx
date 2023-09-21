import { ComponentPropsWithoutRef } from 'react'

import ReactMarkdown from 'react-markdown'

type ReactMarkdownProps = ComponentPropsWithoutRef<typeof ReactMarkdown>

interface MarkdownProps {
  children: ReactMarkdownProps['children']
}

const Markdown = ({ children }: MarkdownProps) => {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>
}

const components: ReactMarkdownProps['components'] = {
  h1: ({ children }) => <h1 className="mb-8 text-5xl">{children}</h1>,
  h2: ({ children }) => <h1 className="mb-4 text-4xl">{children}</h1>,
  h3: ({ children }) => <h1 className="mb-4 text-3xl">{children}</h1>,
  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  pre: ({ children }) => children,
  a: ({ children, ...props }) => (
    <a {...props} target="_blank" className="text-theme-light underline">
      {children}
    </a>
  ),
  code: ({ children, inline }) => {
    if (inline) {
      return (
        <code className="rounded bg-surface-active px-1 py-px text-[0.8em]">
          {children}
        </code>
      )
    }

    return (
      <pre className="mb-4 rounded bg-surface-active px-4 py-3 text-sm">
        <code>{children}</code>
      </pre>
    )
  },
}

export default Markdown