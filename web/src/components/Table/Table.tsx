import { ComponentPropsWithoutRef, useRef } from 'react'

import {
  getCoreRowModel,
  flexRender,
  useReactTable,
  ColumnDef,
  TableMeta,
  VisibilityState,
  Row,
} from '@tanstack/react-table'
import cx from 'classnames'

interface TableProps<TData>
  extends Omit<ComponentPropsWithoutRef<'table'>, 'children' | 'contextMenu'> {
  data: TData[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[]
  meta?: TableMeta<TData>
  visibility?: VisibilityState
  onDoubleClickRow?: (rows: Row<TData>) => void
  enableRowSelection?: boolean
  enableMultiSelect?: boolean
  enableRangeSelect?: boolean
}

function Table<TData>({
  className,
  columns,
  data,
  meta,
  visibility,
  onDoubleClickRow,
  ...props
}: TableProps<TData>) {
  const tableRef = useRef<HTMLTableElement>(null)

  const table = useReactTable({
    data,
    columns,
    meta,
    state: {
      columnVisibility: visibility,
    },
    getCoreRowModel: getCoreRowModel(),
  })

  const hasVisibleHeaders = table
    .getHeaderGroups()
    .some((headerGroup) =>
      headerGroup.headers.some((header) => header.column.columnDef.header)
    )

  return (
    <table
      ref={tableRef}
      className={cx('relative w-full border-collapse text-sm', className)}
      {...props}
    >
      {hasVisibleHeaders && (
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="-mx-4 my-0 px-4 py-0" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const { column } = header
                const { headerAlign } = column.columnDef.meta ?? {}

                return (
                  <th
                    key={header.id}
                    className={cx(
                      'whitespace-nowrap text-xs font-normal uppercase tracking-widest text-muted',
                      'border-b border-solid border-primary',
                      'p-2',
                      'first:pl-4 last:pr-4 [&>svg]:inline-block',
                      {
                        'text-left':
                          headerAlign === 'left' || headerAlign == null,
                        'text-center': headerAlign === 'center',
                        'text-right': headerAlign === 'right',
                      }
                    )}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
      )}
      <tbody className="before:block before:leading-4 before:content-['\200C']">
        {table.getRowModel().rows.map((row, index, rows) => {
          const isPreviousSelected =
            index !== 0 && rows[index - 1].getIsSelected()

          const isNextSelected =
            index !== rows.length - 1 && rows[index + 1].getIsSelected()

          const tableRow = (
            <tr
              key={row.id}
              onDoubleClick={() => onDoubleClickRow?.(row)}
              className={cx('group peer -mx-4 my-0 px-4 py-0', {
                '[&>td]:hover:bg-surface-active': !row.getIsSelected(),
                'bg-white/30': row.getIsSelected(),
              })}
            >
              {row.getVisibleCells().map((cell) => {
                const { meta } = cell.column.columnDef

                return (
                  <td
                    key={cell.id}
                    className={cx('px-2 py-3 text-left first:pl-4 last:pr-4', {
                      'w-px': meta?.shrink,
                      'whitespace-nowrap': !meta?.wrap,
                      'first:rounded-tl': !isPreviousSelected,
                      'first:rounded-bl': !isNextSelected,
                      'last:rounded-tr': !isPreviousSelected,
                      'last:rounded-br': !isNextSelected,
                    })}
                    style={{ width: meta?.columnWidth }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          )

          return tableRow
        })}
      </tbody>
    </table>
  )
}

export default Table
