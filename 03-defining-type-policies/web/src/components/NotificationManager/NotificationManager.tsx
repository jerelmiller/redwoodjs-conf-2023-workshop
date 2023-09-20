import { makeVar, useReactiveVar } from '@apollo/client'
import cx from 'classnames'

export const notificationVar = makeVar<string | null>(null)

const NotificationManager = () => {
  const notification = useReactiveVar(notificationVar)

  return (
    <div
      className={cx(
        'fixed bottom-36 left-1/2 flex max-w-md -translate-x-1/2 flex-col items-center gap-4',
        {
          hidden: notification === null,
        }
      )}
    >
      {notification && (
        <div className="w-max animate-fade-in select-none rounded bg-blue px-4 py-3 text-center text-white">
          {notification}
        </div>
      )}
    </div>
  )
}

let timeoutId: NodeJS.Timeout

NotificationManager.notify = (message: string) => {
  clearTimeout(timeoutId)
  notificationVar(message)

  timeoutId = setTimeout(() => {
    notificationVar(null)
  }, 5000)
}

export default NotificationManager
