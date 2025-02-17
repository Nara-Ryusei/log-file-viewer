import React from 'react';
import { formatDatetime, getLevelStyle } from '../utils/formatters';

// TableHeader renders the fixed header row with sortable columns and resizable handles.
function TableHeader({
  columns,
  columnWidths,
  calculateMessageWidth,
  sortConfig,
  requestSort,
  onMouseDown,
  headerRefs,
}) {
  return (
    <tr>
      {columns.map((col) => {
        const width = col === 'Message' ? calculateMessageWidth() : (columnWidths[col] || 'auto');
        return (
          <th
            key={col}
            ref={col !== 'Message' ? headerRefs.current[col] : null}
            style={{ width: typeof width === 'number' ? width + 'px' : width, position: 'relative', cursor: 'pointer' }}
            onClick={() => requestSort(col)}
          >
            {col} {sortConfig.key === col ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
            {col !== 'Message' && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  height: '100%',
                  width: '5px',
                  cursor: 'col-resize',
                  userSelect: 'none',
                }}
                onMouseDown={(e) => onMouseDown(e, col)}
              />
            )}
          </th>
        );
      })}
    </tr>
  );
}

export default TableHeader;
