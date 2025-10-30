'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BulkCandidatesForm } from '@/components/admin/candidates/BulkCandidatesForm';

export default function AdminBulkCandidatesPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bulk Add Candidates</h1>
        <p className="text-gray-600 mb-6">Upload multiple candidates. You can attach a PDF resume per entry for parsing.</p>
        <div className="mb-4">
          <Link href="/admin/candidates">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
        <BulkCandidatesForm />
      </div>
    </div>
  );
}


