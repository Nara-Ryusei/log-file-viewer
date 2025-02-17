import React from 'react'
import { formatDatetime, getLevelStyle } from '../utils/formatters'

function TableBody({ columns, logs, onRowSelect, columnWidths }) {
  return (
    <tbody>
      {logs.map((log, rowIndex) => (
        <tr key={rowIndex} onClick={() => onRowSelect(log.message)} style={{ cursor: 'pointer' }}>
          {columns.map((col) => {
            let displayValue = log[col]
            if (col === 'datetime') {
              displayValue = formatDatetime(log[col])
            }
            if (col === 'level') {
              return (
                <td key={col} style={{ width: columnWidths[col] }}>
                  <span style={getLevelStyle(log[col] || '')}>{log[col]}</span>
                </td>
              )
            }
            if (col === 'message') {
              return (
                <td
                  key={col}
                  style={{
                    width: columnWidths[col],
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {displayValue}
                </td>
              )
            }
            return <td key={col} style={{ width: columnWidths[col] }}>{displayValue}</td>
          })}
        </tr>
      ))}
    </tbody>
  )
}

export default TableBody
