import React, { useEffect, useRef, useState } from 'react';
import TableHeader from './TableHeader';
import TableFilters from './TableFilters';
import TableBody from './TableBody';
import Pagination from './Pagination';
import './LogTable.css';

// LogTable organizes table state, resizing, and pagination,
// then distributes functionality to specific child components.
function LogTable({ logs }) {
  const columns = ['datetime', 'msec', 'app', 'level', 'Class', 'Message'];
  const [filters, setFilters] = useState({
    datetime: '',
    msec: '',
    app: '',
    level: '',
    Class: '',
    Message: '',
  });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
  const [columnWidths, setColumnWidths] = useState({});
  const [tableWidth, setTableWidth] = useState(0);
  const containerRef = useRef(null);
  // Pagination states with default page size 1000 entries
  const [pageSize, setPageSize] = useState(1000);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Refs for non-elastic columns for resizing (excluding Message)
  const headerRefs = useRef(
    columns.reduce((acc, col) => {
      if (col !== 'Message') {
        acc[col] = React.createRef();
      }
      return acc;
    }, {})
  );

  // Resizing state is stored on ref to manage live updates
  const resizing = useRef({ column: null, startX: 0, startWidth: 0 });

  // On logs update, initialize column widths based on the first row's data,
  // adjusting width optimally using canvas text measurement.
  useEffect(() => {
    if (logs.length > 0) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      // Use a default font that matches the table styling.
      context.font = '16px Arial'; 
      const newWidths = {};
      columns.forEach((col) => {
        if (col !== 'Message') {
          const headerText = col;
          const headerWidth = context.measureText(headerText).width;
          const firstRowContent = logs[0][col] ? logs[0][col].toString() : '';
          const cellWidth = context.measureText(firstRowContent).width;
          // Add padding for comfort.
          const finalWidth = Math.ceil(Math.max(headerWidth, cellWidth)) + 20;
          newWidths[col] = finalWidth;
        }
      });
      setColumnWidths(newWidths);
      updateTableWidth();
      setCurrentPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs]);

  // Update container width on mount and window resize.
  useEffect(() => {
    window.addEventListener('resize', updateTableWidth);
    return () => {
      window.removeEventListener('resize', updateTableWidth);
    };
  }, []);

  // Update container/table width.
  const updateTableWidth = () => {
    if (containerRef.current) {
      setTableWidth(containerRef.current.clientWidth);
    }
  };

  // Update a filter for a given column.
  const updateFilter = (column, value) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
    setCurrentPage(0);
  };

  // Filtering: each log must satisfy all active filters.
  const filteredLogs = logs.filter((log) =>
    columns.every((col) => {
      if (!filters[col]) return true;
      return log[col] && log[col].toString().toLowerCase().includes(filters[col].toLowerCase());
    })
  );

  // Sorting logs based on sortConfig.
  const sortedLogs = React.useMemo(() => {
    let sortableLogs = [...filteredLogs];
    if (sortConfig.key) {
      sortableLogs.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        // Delegate formatting of datetime to utility within child components.
        if (sortConfig.key === 'datetime') {
          aValue = aValue;
          bValue = bValue;
        }
        if (!isNaN(aValue) && !isNaN(bValue)) {
          aValue = Number(aValue);
          bValue = Number(bValue);
        } else {
          aValue = aValue ? aValue.toString() : '';
          bValue = bValue ? bValue.toString() : '';
        }
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLogs;
  }, [filteredLogs, sortConfig]);

  // Pagination: determine total pages and displayed logs.
  const totalPages = Math.ceil(sortedLogs.length / pageSize);
  const displayedLogs = sortedLogs.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  // Begin column resize if not elastic (Message column).
  const onMouseDown = (e, col) => {
    if (col === 'Message') return;
    e.preventDefault();
    resizing.current = {
      column: col,
      startX: e.clientX,
      startWidth: columnWidths[col] || headerRefs.current[col].current.offsetWidth,
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Resize handler updates column width dynamically.
  const onMouseMove = (e) => {
    if (!resizing.current.column) return;
    const { column, startX, startWidth } = resizing.current;
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(startWidth + deltaX, 50);
    setColumnWidths((prev) => ({ ...prev, [column]: newWidth }));
  };

  // Cleanup resizing listeners.
  const onMouseUp = () => {
    resizing.current = { column: null, startX: 0, startWidth: 0 };
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  // Calculate elastic width for Message column.
  const calculateMessageWidth = () => {
    if (!tableWidth) return 'auto';
    let fixedWidthTotal = 0;
    columns.forEach((col) => {
      if (col !== 'Message') {
        fixedWidthTotal += columnWidths[col] || 0;
      }
    });
    const msgWidth = tableWidth - fixedWidthTotal;
    return msgWidth > 50 ? msgWidth : 50;
  };

  // Pagination navigation handlers.
  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  // Hide UI if no logs have been loaded.
  if (logs.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef}>
      {/* Top Pagination and Page Size Navigation */}
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
            columnWidths={columnWidths}
            calculateMessageWidth={calculateMessageWidth}
            sortConfig={sortConfig}
            requestSort={(col) => setSortConfig((prev) => {
              let direction = 'ascending';
              if (prev.key === col && prev.direction === 'ascending') {
                direction = 'descending';
              }
              return { key: col, direction };
            })}
            onMouseDown={onMouseDown}
            headerRefs={headerRefs}
          />
          <TableFilters
            columns={columns}
            filters={filters}
            updateFilter={updateFilter}
            columnWidths={columnWidths}
            calculateMessageWidth={calculateMessageWidth}
          />
        </thead>
        <TableBody
          columns={columns}
          logs={displayedLogs}
          columnWidths={columnWidths}
          calculateMessageWidth={calculateMessageWidth}
        />
      </table>
    </div>
  );
}

export default LogTable;
