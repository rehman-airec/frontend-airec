'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { CreateTenantUserForm } from '@/components/admin/tenants';

/**
 * CreateTenantUserPage
 * Page for tenant admin to create new users (admin or candidate) within their tenant
 */
const CreateTenantUserPage: React.FC = () => {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to dashboard after successful creation
    router.push('/admin/dashboard');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
          <p className="text-gray-600 mt-2">
            Create a new admin or candidate account within your tenant
          </p>
        </div>

        {/* Create User Form Component */}
        <CreateTenantUserForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default CreateTenantUserPage;

