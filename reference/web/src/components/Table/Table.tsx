import { ComponentPropsWithoutRef } from 'react'

import cx from 'classnames'

interface TableProps extends ComponentPropsWithoutRef<'table'> {}

function Table({ className, ...props }: TableProps) {
  return (
    <table
      className={cx('relative w-full border-collapse text-sm', className)}
      {...props}
    />
  )
}

export default Table
