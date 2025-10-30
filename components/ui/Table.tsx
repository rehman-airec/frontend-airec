'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TableSkeleton } from './Skeleton';

export interface Column {
  header: string;
  accessor: string;
  className?: string;
}

interface TableProps<T> {
  columns: Column[];
  data: T[];
  onRowClick?: (row: T) => void;
  renderCell?: (row: T, column: Column) => React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  skeletonRows?: number;
}

function Table<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  renderCell,
  isLoading = false,
  emptyMessage = 'No data available',
  skeletonRows = 5,
}: TableProps<T>) {
  if (isLoading) {
    return <TableSkeleton rows={skeletonRows} columns={columns.length} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                scope="col"
                className={cn(
                  'px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, index) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'hover:bg-blue-50 transition-all duration-200 group',
                onRowClick && 'cursor-pointer',
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className={cn(
                    'px-6 py-4 whitespace-nowrap text-sm text-gray-900 group-hover:text-gray-700',
                    column.className
                  )}
                >
                  {renderCell
                    ? renderCell(row, column)
                    : (row[column.accessor as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { Table };
