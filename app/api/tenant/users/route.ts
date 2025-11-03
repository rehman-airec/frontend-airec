import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export async function GET(request: NextRequest) {
  try {
    // Get subdomain and auth token from headers
    const subdomain = request.headers.get('x-tenant-subdomain');
    const authToken = request.headers.get('authorization');
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Build backend URL
    const backendUrl = `${BACKEND_URL}/tenant/users${queryString ? `?${queryString}` : ''}`;
    
    const headers: Record<string, string> = {
      'x-tenant-subdomain': subdomain || '',
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = authToken;
    }
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, message: errorText || 'Backend request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Users Proxy] Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Proxy request failed' },
      { status: 500 }
    );
  }
}

