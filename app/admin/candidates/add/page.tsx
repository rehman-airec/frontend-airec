'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SingleCandidateForm } from '@/components/admin/candidates/SingleCandidateForm';

export default function AdminAddCandidatePage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Candidate</h1>
        <p className="text-gray-600 mb-6">Add a single candidate. PDF resumes will be parsed automatically.</p>
        <div className="mb-4">
          <Link href="/admin/candidates">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
        <SingleCandidateForm />
      </div>
    </div>
  );
}


