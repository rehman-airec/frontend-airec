"use client";
import React, { useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { useAlert } from '@/hooks/useAlert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('If this email exists, a reset link has been sent.');
      showSuccess('Email sent', 'If this email exists, a reset link has been sent.');
    } catch (err: any) {
      // Show generic message to avoid enumeration
      setMessage('If this email exists, a reset link has been sent.');
      showSuccess('Email sent', 'If this email exists, a reset link has been sent.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Forgot your password?</h1>
        <p className="text-sm text-gray-600 mb-6">Enter your email and we’ll send you a reset link.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-sm text-indigo-600 hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  );
}


