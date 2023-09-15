import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import Duration from '../Duration'
import ProgressBar from '../ProgressBar'
import { isPast } from 'date-fns'

interface PlaybackProgressBarProps {
  isPlaying: boolean
  durationMs: number
  progressMs: number
}

const PlaybackProgressBar = ({
  isPlaying,
  durationMs,
  progressMs,
}: PlaybackProgressBarProps) => {
  const [adjustedProgressMs, setAdjustedProgressMs] = useState(progressMs)

  useEffect(() => {
    if (!isPlaying) {
      return
    }

    const id = setInterval(() => {
      setAdjustedProgressMs((progressMs) => progressMs + 1000)
    }, 1000)

    return () => clearInterval(id)
  }, [isPlaying])

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs tabular-nums text-muted">
        <Duration durationMs={adjustedProgressMs} />
      </span>
      <ProgressBar
        animate={false}
        max={durationMs}
        value={adjustedProgressMs}
        width="100%"
      />
      <span className="text-xs tabular-nums text-muted">
        <Duration durationMs={durationMs} />
      </span>
    </div>
  )
}

export default PlaybackProgressBar
