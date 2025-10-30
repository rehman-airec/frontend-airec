'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function AdminCandidatesPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600">Add, edit, and manage candidate details.</p>
        </div>
        <div className="space-x-2">
          <Link href="/admin/candidates/add">
            <Button>Add Candidate</Button>
          </Link>
          <Link href="/admin/candidates/bulk">
            <Button variant="outline">Bulk Add</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {/* Placeholder table structure for manage list */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LinkedIn</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">—</td>
                  <td className="px-4 py-3 text-sm text-gray-500">—</td>
                  <td className="px-4 py-3 text-sm text-gray-500">—</td>
                  <td className="px-4 py-3 text-sm text-gray-500">—</td>
                  <td className="px-4 py-3 text-sm text-blue-600">—</td>
                  <td className="px-4 py-3 text-right text-sm">
                    <Button variant="outline" size="sm">Edit</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


