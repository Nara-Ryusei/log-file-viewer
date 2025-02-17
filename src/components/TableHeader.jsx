import React from 'react'
import { formatDatetime, getLevelStyle } from '../utils/formatters'

function TableHeader({ columns, sortConfig, requestSort, columnWidths }) {
  return (
    <tr>
      {columns.map((col) => (
        <th
          key={col}
          style={{ width: columnWidths[col], cursor: 'pointer' }}
          onClick={() => requestSort(col)}
        >
          {col} {sortConfig.key === col ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
        </th>
      ))}
    </tr>
  )
}

export default TableHeader
