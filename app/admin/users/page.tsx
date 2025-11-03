'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEmployees, useEmployeeQuota, useDeleteEmployee, Employee } from '@/hooks/useEmployees';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { Table } from '@/components/ui/Table';
import { Users, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import toast from 'react-hot-toast';
import { useUsersStore } from '@/stores/usersStore';

/**
 * Employee List Page
 * 
 * Displays all employees for the current tenant.
 * Only accessible by tenant admins.
 */
const EmployeesPage: React.FC = () => {
  const router = useRouter();
  const { tenant } = useTenant();
  const {
    currentPage,
    pageSize,
    deletingId,
    setCurrentPage,
    setDeletingId,
  } = useUsersStore();

  const { data: employeesData, isLoading: employeesLoading, refetch } = useEmployees(currentPage, pageSize);
  const { data: quotaData, isLoading: quotaLoading } = useEmployeeQuota();
  const deleteEmployeeMutation = useDeleteEmployee();

  const employees = employeesData?.data || [];
  const pagination = employeesData?.pagination || { current: 1, pages: 1, total: 0 };
  const quota = quotaData?.data || { canAdd: true, current: 0, max: 0, remaining: 0 };
  
  // Show UI immediately, don't block on loading
  const isLoading = employeesLoading && !employeesData;
  const isLoadingQuota = quotaLoading && !quotaData;

  const handleDelete = async (employeeId: string, employeeName: string) => {
    if (!confirm(`Are you sure you want to delete ${employeeName}? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(employeeId);
    try {
      await deleteEmployeeMutation.mutateAsync(employeeId);
      refetch();
    } catch (error) {
      // Error handled by mutation's onError
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="h-8 w-8 mr-3 text-blue-600" />
              Employee Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage employees for {tenant?.name || 'your company'}
            </p>
          </div>
          <Link href="/admin/users/create">
            <Button disabled={!quota.canAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </Link>
        </div>

        {/* Quota Information */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {isLoadingQuota ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Employee Quota
                    </h3>
                    <p className="text-sm text-gray-600">
                      {quota.current} of {quota.max} employees
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 ${quota.canAdd ? 'text-green-600' : 'text-red-600'}`}>
                      {quota.canAdd ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                      <span className="font-medium">
                        {quota.canAdd ? `${quota.remaining} slots available` : 'Limit reached'}
                      </span>
                    </div>
                    {!quota.canAdd && (
                      <span className="text-sm text-gray-500">
                        Contact product owner to upgrade
                      </span>
                    )}
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        quota.canAdd ? 'bg-blue-600' : 'bg-red-600'
                      }`}
                      style={{
                        width: `${quota.max > 0 ? Math.min(100, (quota.current / quota.max) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
                </div>
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No employees yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Get started by adding your first employee.
                </p>
                <Link href="/admin/users/create">
                  <Button disabled={!quota.canAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Employee
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employees.map((employee: Employee) => (
                        <tr key={employee._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                              {employee.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                              {employee.phone || '—'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                              {employee.createdBy?.name || 'System'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                              {new Date(employee.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDelete(
                                  employee._id,
                                  `${employee.firstName} ${employee.lastName}`
                                )
                              }
                              disabled={deletingId === employee._id}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              {deletingId === employee._id ? 'Deleting...' : 'Delete'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={pagination.current}
                      totalPages={pagination.pages}
                      onPageChange={setCurrentPage}
                      showInfo={true}
                      totalItems={pagination.total}
                      itemsPerPage={pageSize}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeesPage;

