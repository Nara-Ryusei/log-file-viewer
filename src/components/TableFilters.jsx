import React from 'react';

// TableFilters renders the filter row beneath the header.
function TableFilters({ columns, filters, updateFilter, columnWidths, calculateMessageWidth }) {
  return (
    <tr className="filter-row">
      {columns.map((col) => {
        const width = col === 'Message' ? calculateMessageWidth() : (columnWidths[col] || 'auto');
        return (
          <th key={col} style={{ width: typeof width === 'number' ? width + 'px' : width }}>
            <input
              type="text"
              placeholder={`Filter ${col}`}
              value={filters[col]}
              onChange={(e) => updateFilter(col, e.target.value)}
            />
          </th>
        );
      })}
    </tr>
  );
}

export default TableFilters;
