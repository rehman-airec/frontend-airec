'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUpdateTenant } from '@/hooks/useSuperAdminTenants';
import { TenantInfo } from '@/hooks/useTenant';
import { TenantUpdateData } from './types';

interface EditTenantModalProps {
  tenant: TenantInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * EditTenantModal Component
 * Modal for editing tenant information (name, maxUsers, isActive)
 */
export const EditTenantModal: React.FC<EditTenantModalProps> = ({
  tenant,
  isOpen,
  onClose,
}) => {
  const updateTenant = useUpdateTenant();
  const [formData, setFormData] = useState<TenantUpdateData>({
    name: '',
    maxUsers: 10,
    isActive: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TenantUpdateData, string>>>({});

  // Reset form when tenant changes
  useEffect(() => {
    if (tenant && isOpen) {
      setFormData({
        name: tenant.name,
        maxUsers: tenant.maxUsers,
        isActive: tenant.isActive,
      });
      setErrors({});
    }
  }, [tenant, isOpen]);

  const handleChange = (field: keyof TenantUpdateData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TenantUpdateData, string>> = {};

    if (formData.name !== undefined) {
      if (!formData.name.trim()) {
        newErrors.name = 'Tenant name is required';
      } else if (formData.name.length < 2 || formData.name.length > 100) {
        newErrors.name = 'Tenant name must be between 2 and 100 characters';
      }
    }

    if (formData.maxUsers !== undefined) {
      if (formData.maxUsers < 1) {
        newErrors.maxUsers = 'Max users must be at least 1';
      } else if (tenant && formData.maxUsers < tenant.currentUsersCount) {
        newErrors.maxUsers = `Max users cannot be less than current users (${tenant.currentUsersCount})`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tenant || !validate()) {
      return;
    }

    try {
      await updateTenant.mutateAsync({
        tenantId: tenant._id,
        data: formData,
      });
      onClose();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleClose = () => {
    if (!updateTenant.isPending) {
      setFormData({ name: '', maxUsers: 10, isActive: true });
      setErrors({});
      onClose();
    }
  };

  if (!tenant) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Tenant"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tenant Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Tenant Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter tenant name"
            error={errors.name}
            disabled={updateTenant.isPending}
            required
          />
        </div>

        {/* Max Users */}
        <div>
          <label htmlFor="maxUsers" className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Users <span className="text-red-500">*</span>
          </label>
          <Input
            id="maxUsers"
            type="number"
            value={formData.maxUsers?.toString() || ''}
            onChange={(e) => handleChange('maxUsers', parseInt(e.target.value) || 0)}
            placeholder="Enter maximum users"
            error={errors.maxUsers}
            disabled={updateTenant.isPending}
            min={tenant.currentUsersCount}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Current users: {tenant.currentUsersCount} (minimum: {tenant.currentUsersCount})
          </p>
        </div>

        {/* Active Status */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isActive ?? true}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              disabled={updateTenant.isPending}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Active Tenant</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Inactive tenants cannot be accessed by their users
          </p>
        </div>

        {/* Subdomain (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subdomain (cannot be changed)
          </label>
          <Input
            type="text"
            value={tenant.subdomain}
            disabled
            className="bg-gray-50"
          />
          <p className="mt-1 text-sm text-gray-500">
            Subdomain cannot be modified after creation
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={updateTenant.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={updateTenant.isPending}
            disabled={updateTenant.isPending}
          >
            Update Tenant
          </Button>
        </div>
      </form>
    </Modal>
  );
};

