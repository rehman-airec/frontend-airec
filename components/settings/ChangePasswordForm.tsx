'use client';

import React from 'react';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Eye, EyeOff, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettingsStore } from '@/stores/settingsStore';

interface ChangePasswordFormProps {
  title?: string;
  description?: string;
  embedded?: boolean;
}

const InputWrapper: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {children}
  </div>
);

const ChangePasswordFormInner: React.FC<ChangePasswordFormProps> = ({
  title = 'Change Password',
  description = 'Update your password to keep your account secure',
  embedded = false,
}) => {
  // Use toast notifications instead of modal alerts
  const {
    currentPassword,
    newPassword,
    confirmPassword,
    submitting,
    showCurrent,
    showNew,
    showConfirm,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    setSubmitting,
    setShowCurrent,
    setShowNew,
    setShowConfirm,
    resetPasswordForm,
  } = useSettingsStore();

  const passwordStrength = React.useMemo(() => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[a-z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return score; // 0-5
  }, [newPassword]);

  const strengthMeta = React.useMemo(() => {
    const levels = [
      { label: 'Too weak', color: 'bg-red-500', bar: 1 },
      { label: 'Weak', color: 'bg-orange-500', bar: 2 },
      { label: 'Fair', color: 'bg-yellow-500', bar: 3 },
      { label: 'Good', color: 'bg-green-500', bar: 4 },
      { label: 'Strong', color: 'bg-emerald-600', bar: 5 },
    ];
    const idx = Math.max(0, Math.min(passwordStrength - 1, 4));
    return passwordStrength === 0 ? { label: 'Too weak', color: 'bg-gray-300', bar: 0 } : levels[idx];
  }, [passwordStrength]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.put(API_ROUTES.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      resetPasswordForm();
      const msg = res?.data?.message || 'Password updated successfully';
      toast.success(msg);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to update password';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const form = (
        <form className="space-y-5" onSubmit={onSubmit}>
          <InputWrapper label="Current Password">
            <div className="mt-1 relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
              />
              <button type="button" onMouseDown={(e)=>e.preventDefault()} onClick={() => setShowCurrent(!showCurrent)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </InputWrapper>

          <InputWrapper label="New Password">
            <div className="mt-1 relative">
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
                minLength={6}
              />
              <button type="button" onMouseDown={(e)=>e.preventDefault()} onClick={() => setShowNew(!showNew)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Password strength</span>
                <span>{strengthMeta.label}</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`h-1.5 rounded ${i < strengthMeta.bar ? strengthMeta.color : 'bg-gray-200'}`} />
                ))}
              </div>
              <ul className="mt-2 text-xs text-gray-600 grid grid-cols-2 gap-1">
                <li className="flex items-center gap-1">
                  {newPassword.length >= 8 ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <AlertCircle className="h-3.5 w-3.5 text-gray-400" />} 8+ characters
                </li>
                <li className="flex items-center gap-1">
                  {/[A-Z]/.test(newPassword) ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <AlertCircle className="h-3.5 w-3.5 text-gray-400" />} Uppercase letter
                </li>
                <li className="flex items-center gap-1">
                  {/[a-z]/.test(newPassword) ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <AlertCircle className="h-3.5 w-3.5 text-gray-400" />} Lowercase letter
                </li>
                <li className="flex items-center gap-1">
                  {/[0-9]/.test(newPassword) ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <AlertCircle className="h-3.5 w-3.5 text-gray-400" />} Number
                </li>
              </ul>
            </div>
          </InputWrapper>

          <InputWrapper label="Confirm New Password">
            <div className="mt-1 relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
              />
              <button type="button" onMouseDown={(e)=>e.preventDefault()} onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </InputWrapper>

          <div className="pt-2">
            <Button type="submit" className="w-full" loading={submitting}>
              Update Password
            </Button>
          </div>
        </form>
  );

  if (embedded) {
    return form;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent>
        {form}
      </CardContent>
    </Card>
  );
};

export const ChangePasswordForm = React.memo(ChangePasswordFormInner);


