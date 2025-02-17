import React from 'react';

// Pagination component renders the top navigation for page size selection and page controls.
function Pagination({ pageSize, currentPage, totalPages, handlePageSizeChange, goToPreviousPage, goToNextPage }) {
  return (
    <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <label>
          表示件数:&nbsp;
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={100}>100</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
            <option value={2000}>2000</option>
          </select>
        </label>
      </div>
      <div>
        <button onClick={goToPreviousPage} disabled={currentPage === 0}>前へ</button>
        <span style={{ margin: '0 8px' }}>
          ページ {currentPage + 1} / {totalPages === 0 ? 1 : totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage >= totalPages - 1}>次へ</button>
      </div>
    </div>
  );
}

export default Pagination;
