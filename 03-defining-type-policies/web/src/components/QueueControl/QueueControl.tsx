import { List } from 'lucide-react'

import { Link } from '@redwoodjs/router'

import PlaybarControlButton from 'src/components/PlaybarControlButton'

const QueueControl = () => {
  return (
    <Link
      to=""
      className="block leading-none"
      onClick={() =>
        console.warn('Queue page is not implemented and therefore a noop.')
      }
    >
      <PlaybarControlButton active={false} disabled={false} tooltip="Queue">
        <List strokeWidth={1.5} />
      </PlaybarControlButton>
    </Link>
  )
}

export default QueueControl
