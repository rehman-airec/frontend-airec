'use client';

import React from 'react';
import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm';
import Link from 'next/link';

export default function CandidateChangePasswordPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security</h1>
          <p className="text-gray-600">Manage your password and security settings</p>
        </div>
        <Link href="/candidate/settings" className="text-sm text-indigo-600 hover:underline">Back to Settings</Link>
      </div>
      <ChangePasswordForm />
    </div>
  );
}


