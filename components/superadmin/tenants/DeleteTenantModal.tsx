'use client';

import React, { useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useDeleteTenant } from '@/hooks/useSuperAdminTenants';
import { TenantInfo } from '@/hooks/useTenant';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useTenantManagementStore } from '@/stores/tenantManagementStore';

interface DeleteTenantModalProps {
  tenant: TenantInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * DeleteTenantModal Component
 * Modal for deleting (soft or hard) a tenant
 */
export const DeleteTenantModal: React.FC<DeleteTenantModalProps> = ({
  tenant,
  isOpen,
  onClose,
}) => {
  const deleteTenant = useDeleteTenant();
  const {
    forceDelete,
    confirmText,
    setForceDelete,
    setConfirmText,
    resetDeleteState,
  } = useTenantManagementStore();

  const expectedConfirmText = tenant?.name || '';

  const handleDelete = async () => {
    if (!tenant) return;

    if (confirmText !== expectedConfirmText) {
      return;
    }

    try {
      await deleteTenant.mutateAsync({
        tenantId: tenant._id,
        force: forceDelete,
      });
      handleClose();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetDeleteState();
    }
  }, [isOpen, resetDeleteState]);

  const handleClose = () => {
    if (!deleteTenant.isPending) {
      resetDeleteState();
      onClose();
    }
  };

  if (!tenant) return null;

  const isConfirmed = confirmText === expectedConfirmText;
  const isDeleting = deleteTenant.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Tenant"
      size="md"
    >
      <div className="space-y-6">
        {/* Warning Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">
                {forceDelete ? 'Permanent Deletion Warning' : 'Deactivate Tenant'}
              </h3>
              <p className="text-sm text-red-700">
                {forceDelete ? (
                  <>
                    This will <strong>permanently delete</strong> the tenant and <strong>all related data</strong> including:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>All admin and candidate accounts</li>
                      <li>All jobs and applications</li>
                      <li>All files and documents</li>
                      <li>All tenant configuration</li>
                    </ul>
                    <strong className="block mt-2">This action cannot be undone!</strong>
                  </>
                ) : (
                  <>
                    This will deactivate the tenant. Users will not be able to access the platform, 
                    but all data will be preserved. You can reactivate it later by editing the tenant.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Tenant Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Tenant Name:</span>
            <span className="text-sm text-gray-900">{tenant.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Subdomain:</span>
            <span className="text-sm text-gray-900">{tenant.subdomain}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Current Users:</span>
            <span className="text-sm text-gray-900">
              {tenant.currentUsersCount} / {tenant.maxUsers}
            </span>
          </div>
        </div>

        {/* Delete Type Toggle */}
        <div className="border border-gray-200 rounded-lg p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={forceDelete}
              onChange={(e) => setForceDelete(e.target.checked)}
              disabled={isDeleting}
              className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Trash2 className="h-4 w-4 text-red-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Permanently delete all data
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Check this to permanently delete the tenant and all related data. 
                Leave unchecked to only deactivate.
              </p>
            </div>
          </label>
        </div>

        {/* Confirmation Input */}
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
            Type <strong>"{expectedConfirmText}"</strong> to confirm:
          </label>
          <input
            id="confirm"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={expectedConfirmText}
            disabled={isDeleting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {confirmText && !isConfirmed && (
            <p className="mt-1 text-sm text-red-600">
              Text must match exactly: "{expectedConfirmText}"
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            loading={isDeleting}
            disabled={!isConfirmed || isDeleting}
          >
            {forceDelete ? 'Delete Permanently' : 'Deactivate Tenant'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

