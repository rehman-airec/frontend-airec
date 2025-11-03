'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTenants } from '@/hooks/useTenant';
import { Button } from '@/components/ui/Button';
import { Plus, Building2 } from 'lucide-react';
import {
  TenantsStats,
  TenantsFilters,
} from '@/components/admin/tenants';
import {
  TenantCard,
  EditTenantModal,
  DeleteTenantModal,
} from '@/components/superadmin/tenants';
import { TenantInfo } from '@/hooks/useTenant';
import { Pagination } from '@/components/ui/Pagination';
import withAuth from '@/lib/withAuth';
import { useTenantManagementStore } from '@/stores/tenantManagementStore';

/**
 * Super Admin Tenants List Page
 * Lists all tenants for super admin
 */
const SuperAdminTenantsPage: React.FC = () => {
  const router = useRouter();
  const {
    searchInput,
    searchQuery,
    statusFilter,
    currentPage,
    pageSize,
    editingTenant,
    deletingTenant,
    setSearchInput,
    setSearchQuery,
    applySearch,
    setStatusFilter,
    setCurrentPage,
    setEditingTenant,
    setDeletingTenant,
  } = useTenantManagementStore();

  const { data: tenantsData, isLoading, refetch } = useTenants({
    page: currentPage,
    limit: pageSize,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    search: searchQuery || undefined,
  });

  const tenants = tenantsData?.data?.tenants || [];
  const pagination = tenantsData?.data?.pagination || { current: 1, pages: 1, total: 0 };

  const handleSearch = () => {
    applySearch(); // Apply searchInput to searchQuery
    refetch();
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
    refetch();
  };

  const handleStatusFilterChange = (filter: 'all' | 'active' | 'inactive') => {
    setStatusFilter(filter);
    setCurrentPage(1);
    refetch();
  };

  const handleEdit = (tenant: TenantInfo) => {
    setEditingTenant(tenant);
  };

  const handleDelete = (tenant: TenantInfo) => {
    setDeletingTenant(tenant);
  };

  const handleCloseEdit = () => {
    setEditingTenant(null);
  };

  const handleCloseDelete = () => {
    setDeletingTenant(null);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Building2 className="h-8 w-8 mr-3 text-blue-600" />
              Tenant Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all company tenants and their configurations
            </p>
          </div>
          <Link href="/superadmin/tenants/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Tenant
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <TenantsStats
          tenants={tenants}
          pagination={pagination}
          isLoading={isLoading}
        />

        {/* Filters */}
        <TenantsFilters
          searchQuery={searchInput}
          statusFilter={statusFilter}
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          onStatusFilterChange={handleStatusFilterChange}
          isLoading={isLoading}
        />

        {/* Tenants List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : tenants.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first tenant'
              }
            </p>
            <Link href="/superadmin/tenants/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Tenant
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tenants.map((tenant: TenantInfo) => (
              <TenantCard
                key={tenant._id}
                tenant={tenant}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8">
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

        {/* Edit Tenant Modal */}
        <EditTenantModal
          tenant={editingTenant}
          isOpen={!!editingTenant}
          onClose={handleCloseEdit}
        />

        {/* Delete Tenant Modal */}
        <DeleteTenantModal
          tenant={deletingTenant}
          isOpen={!!deletingTenant}
          onClose={handleCloseDelete}
        />
      </div>
    </div>
  );
};

export default withAuth(['superadmin'])(SuperAdminTenantsPage);

