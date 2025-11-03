'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SingleCandidateForm } from '@/components/admin/candidates/SingleCandidateForm';

export default function AdminEditCandidatePage() {
  const params = useParams();
  const candidateId = params.id as string;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Candidate</h1>
        <p className="text-gray-600 mb-6">Update candidate information. PDF resumes will be parsed automatically.</p>
        <div className="mb-4">
          <Link href="/admin/candidates">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
        <SingleCandidateForm candidateId={candidateId} />
      </div>
    </div>
  );
}

