import React from 'react'

function TableFilters({ columns, filters, updateFilter, columnWidths }) {
  return (
    <tr className="filter-row">
      {columns.map((col) => (
        <th key={col} style={{ width: columnWidths[col] }}>
          <input
            type="text"
            placeholder={`Filter ${col}`}
            value={filters[col]}
            onChange={(e) => updateFilter(col, e.target.value)}
            style={{ width: '95%' }}
          />
        </th>
      ))}
    </tr>
  )
}

export default TableFilters
