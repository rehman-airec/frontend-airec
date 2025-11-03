'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Building2, Globe, AlertCircle } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';

interface NoTenantStateProps {
  subdomain?: string | null;
  isLoading?: boolean;
  error?: any;
}

/**
 * NoTenantState Component
 * 
 * Displays a message when tenant context is missing.
 * Shows different messages for different scenarios.
 */
export const NoTenantState: React.FC<NoTenantStateProps> = ({ 
  subdomain = null, 
  isLoading = false,
  error = null 
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const { refetch } = useTenant();

  // If subdomain is detected but tenant not found in DB
  if (subdomain) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Company Not Found
          </h3>
          <p className="text-gray-600 mb-2">
            The company <strong>{subdomain}</strong> could not be found.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please check the URL or contact support if you believe this is an error.
          </p>
          
          {isDevelopment && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left text-xs space-y-2">
              <p className="font-medium text-gray-900">Debug Information:</p>
              <div className="space-y-1 text-gray-600">
                <p>Subdomain: <code className="bg-white px-2 py-1 rounded">{subdomain}</code></p>
                <p>Hostname: <code className="bg-white px-2 py-1 rounded">{typeof window !== 'undefined' ? window.location.hostname : 'N/A'}</code></p>
                <p>Origin: <code className="bg-white px-2 py-1 rounded">{typeof window !== 'undefined' ? window.location.origin : 'N/A'}</code></p>
                <p>API URL: <code className="bg-white px-2 py-1 rounded">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1'}</code></p>
                <p>Loading: <code className="bg-white px-2 py-1 rounded">{isLoading ? 'Yes' : 'No'}</code></p>
                {error && (
                  <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                    <p className="text-red-800 font-medium mb-1">❌ API Error Detected:</p>
                    <p className="text-xs text-red-700">
                      <strong>Code:</strong> <code>{error.code || 'N/A'}</code>
                    </p>
                    <p className="text-xs text-red-700">
                      <strong>Message:</strong> <code>{error.message || 'Unknown error'}</code>
                    </p>
                    {error.response && (
                      <p className="text-xs text-red-700">
                        <strong>Status:</strong> <code>{error.response.status} {error.response.statusText}</code>
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-2">
                      Check browser console (F12) for detailed error logs.
                    </p>
                  </div>
                )}
                {!error && !isLoading && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-yellow-800 text-xs">
                      ⚠️ No error detected, but tenant not found. Query may have returned null. Check console logs.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={async () => {
                    console.log('[Retry] Refetching tenant...');
                    try {
                      await refetch();
                      console.log('[Retry] Refetch completed');
                    } catch (err) {
                      console.error('[Retry] Refetch error:', err);
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                >
                  🔄 Retry Fetch
                </button>
                <button
                  onClick={() => {
                    console.log('[Clear] Clearing React Query cache for tenant...');
                    // Clear the query cache by accessing the query client
                    if (typeof window !== 'undefined') {
                      // Force a page reload to clear all caches
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm font-medium"
                >
                  🗑️ Clear Cache & Reload
                </button>
                <button
                onClick={async () => {
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
                  const testUrl = `${apiUrl}/tenant/public-info`;
                  console.log('[Test] Testing API call:', testUrl);
                  console.log('[Test] From origin:', window.location.origin);
                  console.log('[Test] Subdomain:', subdomain);
                  
                  try {
                    // First try with fetch
                    console.log('[Test] Attempting fetch with headers:', {
                      'x-tenant-subdomain': subdomain || '',
                      'Origin': window.location.origin,
                    });
                    
                    const response = await fetch(testUrl, {
                      method: 'GET',
                      headers: {
                        'x-tenant-subdomain': subdomain || '',
                      },
                      credentials: 'include',
                      mode: 'cors',
                    });
                    
                    console.log('[Test] Response status:', response.status);
                    console.log('[Test] Response headers:', Object.fromEntries(response.headers.entries()));
                    
                    if (response.ok) {
                      const data = await response.json();
                      console.log('[Test] Success! Response data:', data);
                      alert(`✅ API Test Successful!\n\nTenant: ${data.data?.name || 'N/A'}\nSubdomain: ${data.data?.subdomain || 'N/A'}\n\nCheck console for full response.`);
                    } else {
                      const text = await response.text();
                      console.error('[Test] Failed!', response.status, text);
                      alert(`❌ API Test Failed!\n\nStatus: ${response.status}\nResponse: ${text.substring(0, 200)}\n\nCheck console for details.`);
                    }
                  } catch (error: any) {
                    console.error('[Test] Network error:', error);
                    alert(`❌ Network Error!\n\n${error.message}\n\nThis might be:\n- CORS blocking\n- Browser extension blocking\n- Backend not running\n\nCheck console for details.`);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
              >
                🧪 Test API Connection
              </button>
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-400 mt-4">
            Current URL: {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}
          </div>
        </CardContent>
      </Card>
    );
  }

  // No subdomain detected (main domain)
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Company-Specific Jobs
        </h3>
        <p className="text-gray-600 mb-4">
          Jobs are organized by company. Please access jobs through your company's dedicated subdomain.
        </p>
        {isDevelopment ? (
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm">
            <p className="font-medium text-gray-900 mb-2">For Local Development:</p>
            <p className="text-gray-600 mb-1">
              Access jobs using your company subdomain:
            </p>
            <code className="block bg-white p-2 rounded border text-blue-600">
              http://[company-subdomain].localhost:3000/jobs
            </code>
            <p className="text-gray-600 mt-3 mb-1">
              Or add header to API requests:
            </p>
            <code className="block bg-white p-2 rounded border text-blue-600">
              x-tenant-subdomain: [company-subdomain]
            </code>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm">
            <p className="font-medium text-gray-900 mb-2">How to Access Jobs:</p>
            <p className="text-gray-600">
              Contact your company administrator for your dedicated jobs portal URL.
              Jobs are accessible at: <strong>[company].airec.com/jobs</strong>
            </p>
          </div>
        )}
        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
          <Globe className="h-4 w-4 mr-2" />
          <span>Main portal does not display company-specific jobs</span>
        </div>
      </CardContent>
    </Card>
  );
};

