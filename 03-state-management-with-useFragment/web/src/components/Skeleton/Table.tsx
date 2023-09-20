import { ReactElement } from 'react'

import { randomBetween, range } from 'src/utils/common'

import Text from './Text'

interface TableProps {
  rows: number
  headers?: boolean
  columns: number | ReactElement[]
}

const Table = ({
  headers = true,
  rows: rowCount,
  columns: columnConfig,
}: TableProps) => {
  const rows = range(0, rowCount)
  const columns =
    typeof columnConfig === 'number' ? range(0, columnConfig) : columnConfig

  return (
    <table className="w-full border-collapse">
      {headers && (
        <thead>
          <tr>
            {columns.map((_, index) => (
              <th
                key={index}
                className="border-b border-solid border-primary px-2 py-3 text-xs"
              >
                <Text width={`${randomBetween(20, 60)}%`} />
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row) => (
          <tr key={row}>
            {columns.map((column, index) => (
              <td key={index} className="px-2 py-4 text-sm">
                {typeof column === 'number' ? <Text /> : column}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
