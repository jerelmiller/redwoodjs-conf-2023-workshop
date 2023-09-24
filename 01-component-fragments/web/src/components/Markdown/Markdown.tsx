import { ComponentPropsWithoutRef } from 'react'

import ReactMarkdown from 'react-markdown'

import { Link } from '@redwoodjs/router'

type ReactMarkdownProps = ComponentPropsWithoutRef<typeof ReactMarkdown>

interface MarkdownProps {
  children: ReactMarkdownProps['children']
}

const Markdown = ({ children }: MarkdownProps) => {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>
}

const components: ReactMarkdownProps['components'] = {
  h1: ({ children }) => <h1 className="mb-8 text-5xl">{children}</h1>,
  h2: ({ children }) => (
    <h1 className="mb-4 mt-6 text-3xl first:mt-0">{children}</h1>
  ),
  h3: ({ children }) => <h1 className="mb-4 text-2xl">{children}</h1>,
  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  pre: ({ children }) => children,
  img: ({ src, ...props }) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img src={src?.replace('./web/public', '')} {...props} />
  ),
  a: ({ children, href, ...props }) => {
    const to = href?.replace(window.location.origin, '') ?? ''

    if (to.match(/^http/)) {
      return (
        <a
          {...props}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-theme-light underline"
        >
          {children}
        </a>
      )
    }

    return (
      <Link to={to} className="text-theme-light underline">
        {children}
      </Link>
    )
  },
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
  ol: ({ children }) => <ol className="mb-4 list-decimal pl-4">{children}</ol>,
  ul: ({ children }) => <ol className="mb-4 list-disc pl-4">{children}</ol>,
  li: ({ children }) => <li className="[&>pre]:mt-4">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-4 border-l-primary pl-4 text-muted">
      {children}
    </blockquote>
  ),
}

export default Markdown
