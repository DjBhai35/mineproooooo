import React from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  emptyMessage?: string;
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No transactions recorded',
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`table-responsive ${className}`}>
      <table className="table table-minepro align-middle mb-0">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`text-${col.align || 'left'} ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading table data...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-muted small">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={keyExtractor(row, rowIdx)}>
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`text-${col.align || 'left'} ${col.className || ''}`}
                  >
                    {col.cell ? col.cell(row, rowIdx) : col.accessorKey ? String(row[col.accessorKey] ?? '') : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages && totalPages > 1 && onPageChange && (
        <div className="d-flex align-items-center justify-content-between px-3 py-3 border-top bg-light-subtle">
          <small className="text-muted">
            Page {currentPage} of {totalPages}
          </small>
          <nav aria-label="Table pagination">
            <ul className="pagination pagination-sm mb-0 gap-1">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link rounded"
                  onClick={() => onPageChange((currentPage || 1) - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="bi bi-chevron-left" />
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <li
                  key={pageNum}
                  className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                >
                  <button
                    className={`page-link rounded ${currentPage === pageNum ? 'bg-success border-success text-white' : ''}`}
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link rounded"
                  onClick={() => onPageChange((currentPage || 1) + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
