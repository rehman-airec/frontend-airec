'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { CreateTenantForm } from '@/components/admin/tenants';
import withAuth from '@/lib/withAuth';

/**
 * CreateTenantPage
 * Page for super admin to create a new tenant and tenant admin account
 * Accessible only at /superadmin/tenants/create
 */
const CreateTenantPage: React.FC = () => {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to superadmin tenants list after successful creation
    setTimeout(() => {
      router.push('/superadmin/tenants');
    }, 500);
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
          <h1 className="text-3xl font-bold text-gray-900">Create New Tenant</h1>
          <p className="text-gray-600 mt-2">
            Create a new company tenant and tenant admin account
          </p>
        </div>

        {/* Create Tenant Form Component */}
        <CreateTenantForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default withAuth(['superadmin'])(CreateTenantPage);

