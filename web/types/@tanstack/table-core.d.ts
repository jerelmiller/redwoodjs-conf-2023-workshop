import type { CSSProperties } from 'react'

import type { RowData } from '@tanstack/react-table'

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    headerAlign?: 'left' | 'center' | 'right'
    shrink?: boolean
    wrap?: boolean
    columnWidth?: CSSProperties['width']
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    [key: string]: unknown
  }
}
