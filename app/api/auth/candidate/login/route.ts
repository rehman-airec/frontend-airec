import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export async function POST(request: NextRequest) {
  try {
    // Get subdomain from header (sent by frontend)
    const subdomain = request.headers.get('x-tenant-subdomain');
    
    // Get request body
    const body = await request.json();
    
    // Proxy the request to the backend
    const backendUrl = `${BACKEND_URL}/auth/candidate/login`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'x-tenant-subdomain': subdomain || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
    console.error('[Auth Proxy] Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Proxy request failed' },
      { status: 500 }
    );
  }
}

