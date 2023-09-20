import cx from 'classnames'
import { Volume1 } from 'lucide-react'
import {
  ActiveDeviceBannerCellQuery,
  ActiveDeviceBannerCellQueryVariables,
} from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

export const QUERY = gql`
  query ActiveDeviceBannerCellQuery {
    me {
      player {
        playbackState {
          device {
            id
            name
          }
        }
      }
    }
  }
`

type ActiveDeviceBannerCellProps = CellSuccessProps<
  ActiveDeviceBannerCellQuery,
  ActiveDeviceBannerCellQueryVariables
>

export const Success = ({ me }: ActiveDeviceBannerCellProps) => {
  const activeDevice = me.player.playbackState?.device

  return activeDevice ? (
    <div
      className={cx(
        'flex items-center justify-end',
        'before:[--arrow-size:0.625rem]',
        'border-solid before:border-b-green before:border-l-transparent before:border-r-transparent before:[border-bottom-width:var(--arrow-size)] before:[border-left-width:var(--arrow-size)] before:[border-right-width:var(--arrow-size)]',
        'relative rounded bg-green px-6 py-1 text-sm leading-none',
        'pointer-events-none before:absolute before:right-[10.5rem] before:top-0 before:-translate-y-full'
      )}
    >
      <Volume1 size="1.125rem" /> Listening on {activeDevice.name}
    </div>
  ) : null
}
