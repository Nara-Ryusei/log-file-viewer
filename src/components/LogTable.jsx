import React, { useState } from 'react'
import TableHeader from './TableHeader'
import TableFilters from './TableFilters'
import TableBody from './TableBody'
import Pagination from './Pagination'
import './LogTable.css'

function LogTable({ logs, onRowSelect }) {
  // All column names in lower case
  const columns = ['datetime', 'msec', 'app', 'level', 'class', 'message']
  // Fixed width values for each column
  const fixedColumnWidths = {
    datetime: '150px',
    msec: '80px',
    app: '100px',
    level: '80px',
    class: '100px',
    message: '300px'
  }

  const [filters, setFilters] = useState({
    datetime: '',
    msec: '',
    app: '',
    level: '',
    class: '',
    message: ''
  })
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' })

  const updateFilter = (column, value) => {
    setFilters((prev) => ({ ...prev, [column]: value }))
  }

  const filteredLogs = logs.filter((log) =>
    columns.every((col) => {
      if (!filters[col]) return true
      return log[col] && log[col].toString().toLowerCase().includes(filters[col].toLowerCase())
    })
  )

  const sortedLogs = React.useMemo(() => {
    let sortableLogs = [...filteredLogs]
    if (sortConfig.key) {
      sortableLogs.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]
        if (sortConfig.key === 'datetime') {
          aValue = aValue
          bValue = bValue
        }
        if (!isNaN(aValue) && !isNaN(bValue)) {
          aValue = Number(aValue)
          bValue = Number(bValue)
        } else {
          aValue = aValue ? aValue.toString() : ''
          bValue = bValue ? bValue.toString() : ''
        }
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableLogs
  }, [filteredLogs, sortConfig])

  // Pagination states.
  const [pageSize, setPageSize] = useState(1000)
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = Math.ceil(sortedLogs.length / pageSize)
  const displayedLogs = sortedLogs.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value)
    setPageSize(newSize)
    setCurrentPage(0)
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))
  }

  if (logs.length === 0) {
    return null
  }

  return (
    <div>
      <Pagination
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageSizeChange={handlePageSizeChange}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
      <table className="spreadsheet" style={{ tableLayout: 'fixed', width: '100%' }}>
        <thead>
          <TableHeader
            columns={columns}
            sortConfig={sortConfig}
            requestSort={(col) =>
              setSortConfig((prev) => {
                let direction = 'ascending'
                if (prev.key === col && prev.direction === 'ascending') {
                  direction = 'descending'
                }
                return { key: col, direction }
              })
            }
            columnWidths={fixedColumnWidths}
          />
          <TableFilters
            columns={columns}
            filters={filters}
            updateFilter={updateFilter}
            columnWidths={fixedColumnWidths}
          />
        </thead>
        <TableBody
          columns={columns}
          logs={displayedLogs}
          onRowSelect={onRowSelect}
          columnWidths={fixedColumnWidths}
        />
      </table>
    </div>
  )
}

export default LogTable
