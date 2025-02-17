import React from 'react';
import { formatDatetime, getLevelStyle } from '../utils/formatters';

// TableBody renders the table rows (tbody) with formatted cells.
// For the Message column, text wrapping is enabled to prevent horizontal scrolling.
function TableBody({ columns, logs, columnWidths, calculateMessageWidth }) {
  return (
    <tbody>
      {logs.map((log, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((col) => {
            const width = col === 'Message' ? calculateMessageWidth() : (columnWidths[col] || 'auto');
            let displayValue = log[col];
            if (col === 'datetime') {
              displayValue = formatDatetime(log[col]);
            }
            if (col === 'level') {
              return (
                <td key={col} style={{ width: typeof width === 'number' ? width + 'px' : width }}>
                  <span style={getLevelStyle(log[col] || '')}>{log[col]}</span>
                </td>
              );
            }
            // For the Message column, allow word wrapping to avoid horizontal scroll.
            if (col === 'Message') {
              return (
                <td
                  key={col}
                  style={{
                    width: typeof width === 'number' ? width + 'px' : width,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word'
                  }}
                >
                  {displayValue}
                </td>
              );
            }
            return (
              <td
                key={col}
                style={{
                  width: typeof width === 'number' ? width + 'px' : width,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {displayValue}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;
