'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface Applicant {
  _id: string;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  status: string;
  appliedAt: string;
  job: {
    title: string;
  };
}

interface ApplicantsTableProps {
  applicants: Applicant[];
  isLoading?: boolean;
  currentPage?: number;
  pageSize?: number;
}

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({ applicants, isLoading }) => {
  const router = useRouter();

  const handleRowClick = (row: any) => {
    router.push(`/admin/applications/${row.id}`);
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
      'New': 'info',
      'In Review': 'secondary',
      'Interview': 'warning',
      'Offer': 'success',
      'Hired': 'success',
      'Rejected': 'danger',
    };
    return variants[status] || 'default';
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Job Title', accessor: 'jobTitle' },
    { header: 'Status', accessor: 'status' },
    { header: 'Applied Date', accessor: 'appliedDate' },
  ];

  const data = applicants.map((applicant: Applicant) => ({
    id: applicant._id,
    name: `${applicant.candidate.firstName} ${applicant.candidate.lastName}`,
    email: applicant.candidate.email,
    phone: applicant.candidate.phone,
    jobTitle: applicant.job.title,
    status: applicant.status,
    appliedDate: formatDate(applicant.appliedAt),
    _original: applicant,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
        <p className="text-sm text-gray-600 mt-1">
          {applicants.length} application{applicants.length !== 1 ? 's' : ''} found
        </p>
      </div>
      <div className="p-0">
        <Table
          columns={columns}
          data={data}
          onRowClick={handleRowClick}
          isLoading={isLoading}
          skeletonRows={8}
          emptyMessage="No applications found"
          renderCell={(row: any, column: any) => {
            if (column.accessor === 'status') {
              return (
                <Badge 
                  variant={getStatusVariant(row.status)}
                  animated
                  size="sm"
                >
                  {row.status}
                </Badge>
              );
            }
            return <span className="text-gray-900 font-medium">{row[column.accessor as keyof typeof row]}</span>;
          }}
        />
      </div>
    </div>
  );
};

export { ApplicantsTable };
