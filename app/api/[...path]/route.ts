import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

/**
 * Generic API Proxy Route
 * 
 * This catch-all route handles all API proxy requests by forwarding them to the backend.
 * Format: /api/[any-backend-path]
 * Example: /api/jobs/admin/jobs -> http://localhost:5001/api/v1/jobs/admin/jobs
 */
export async function GET(request: NextRequest) {
  return handleProxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleProxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleProxyRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleProxyRequest(request, 'DELETE');
}

export async function PATCH(request: NextRequest) {
  return handleProxyRequest(request, 'PATCH');
}

async function handleProxyRequest(request: NextRequest, method: string) {
  try {
    // Get the path from the URL (remove /api prefix)
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    // Remove 'api' from the beginning
    if (pathSegments[0] === 'api') {
      pathSegments.shift();
    }
    
    // Reconstruct the backend path
    const backendPath = `/${pathSegments.join('/')}`;
    
    // Get query parameters
    const queryString = url.searchParams.toString();
    
    // Build backend URL
    const backendUrl = `${BACKEND_URL}${backendPath}${queryString ? `?${queryString}` : ''}`;
    
    // Get headers from request
    const subdomain = request.headers.get('x-tenant-subdomain');
    const authToken = request.headers.get('authorization');
    
    const headers: Record<string, string> = {
      'x-tenant-subdomain': subdomain || '',
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = authToken;
    }
    
    // Check content type FIRST before reading body (FormData check)
    const contentType = request.headers.get('content-type');
    const isFormData = contentType && contentType.includes('multipart/form-data');
    
    // Special handling for FormData (multipart/form-data)
    if (isFormData) {
      // For FormData, we need to use the request body directly
      const formData = await request.formData();
      
      const response = await fetch(backendUrl, {
        method,
        headers: {
          'x-tenant-subdomain': subdomain || '',
          // Don't set Content-Type for FormData - fetch will set it with boundary
          ...(authToken ? { 'Authorization': authToken } : {}),
        },
        body: formData,
      });
      
      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          const errorText = await response.text();
          errorData = { success: false, message: errorText || 'Backend request failed' };
        }
        return NextResponse.json(errorData, { status: response.status });
      }
      
      // Try to parse as JSON, fallback to text
      let data: any;
      const responseContentType = response.headers.get('content-type');
      if (responseContentType && responseContentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { success: true, data: await response.text() };
      }
      return NextResponse.json(data);
    }
    
    // Handle regular JSON requests
    // Get request body for POST/PUT/PATCH (only if not FormData)
    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method) && !isFormData) {
      try {
        body = await request.text();
      } catch (e) {
        // Body might not exist
        body = undefined;
      }
    }
    
    // Set Content-Type only for non-FormData requests
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(backendUrl, {
      method,
      headers,
      body: body || undefined,
      cache: 'no-store',
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        const errorText = await response.text();
        errorData = { success: false, message: errorText || 'Backend request failed' };
      }
      return NextResponse.json(errorData, { status: response.status });
    }

    // Try to parse as JSON, fallback to text
    let data: any;
    const responseContentType = response.headers.get('content-type');
    if (responseContentType && responseContentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { success: true, data: await response.text() };
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`[API Proxy ${method}] Error:`, error);
    return NextResponse.json(
      { success: false, message: error.message || 'Proxy request failed' },
      { status: 500 }
    );
  }
}

