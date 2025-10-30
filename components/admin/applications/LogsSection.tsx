'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Clock, User, Info } from 'lucide-react';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';

interface LogsSectionProps {
  logs: any[];
}

const ROWS_PER_PAGE = 10;

const LogsSection: React.FC<LogsSectionProps> = ({ logs }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Paginate logs
  const paginatedLogs = useMemo(() => {
    if (!logs || logs.length === 0) return [];
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    return logs.slice(startIndex, endIndex);
  }, [logs, currentPage]);

  const totalPages = Math.ceil((logs?.length || 0) / ROWS_PER_PAGE);

  // Get user name from log metadata or userId
  const getUserName = (log: any) => {
    if (log.metadata?.createdBy) return log.metadata.createdBy;
    if (log.metadata?.changedBy) return log.metadata.changedBy;
    if (log.metadata?.deletedBy) return log.metadata.deletedBy;
    return log.userRole || 'System';
  };

  // Get details from metadata
  const getDetails = (log: any) => {
    const details = [];
    if (log.metadata) {
      if (log.metadata.changes) details.push(log.metadata.changes);
      if (log.metadata.eventDate) details.push(`Date: ${new Date(log.metadata.eventDate).toLocaleDateString()}`);
      if (log.metadata.eventTime) details.push(`Time: ${log.metadata.eventTime}`);
      if (log.metadata.location) details.push(`Location: ${log.metadata.location}`);
    }
    return details.length > 0 ? details.join(' | ') : log.action;
  };

  if (!logs || logs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          No logs available
        </CardContent>
      </Card>
    );
  }

  const columns = [
    { header: 'User', accessor: 'user' },
    { header: 'Action', accessor: 'action' },
    { header: 'Details', accessor: 'details' },
    { header: 'Timestamp', accessor: 'timestamp' },
  ];

  const tableData = paginatedLogs.map((log, index) => ({
    id: `${log.timestamp}-${index}`,
    log, // Store the full log object for renderCell access
  }));

  const renderCell = (row: typeof tableData[0], column: typeof columns[number]) => {
    const { log } = row;
    switch (column.accessor) {
      case 'user':
        return (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">{getUserName(log)}</span>
          </div>
        );
      case 'action':
        return <span className="text-sm text-gray-700">{log.action}</span>;
      case 'details':
        return (
          <div className="flex items-center space-x-1">
            <Info className="h-3 w-3 text-gray-400" />
            <span className="text-sm text-gray-600">{getDetails(log)}</span>
          </div>
        );
      case 'timestamp':
        return (
          <span className="text-sm text-gray-500">
            {new Date(log.timestamp).toLocaleString()}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Activity Logs
          </h2>
          <span className="text-sm text-gray-500">
            Total: {logs.length} entries
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table columns={columns} data={tableData} renderCell={renderCell} emptyMessage="No logs available" />
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * ROWS_PER_PAGE + 1} to {Math.min(currentPage * ROWS_PER_PAGE, logs.length)} of {logs.length} entries
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { LogsSection };
