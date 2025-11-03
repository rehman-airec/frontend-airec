import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export async function GET(request: NextRequest) {
  try {
    // Get subdomain from header (sent by frontend)
    const subdomain = request.headers.get('x-tenant-subdomain');
    
    // Get query parameters from the request
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Build backend URL with query params
    const backendUrl = `${BACKEND_URL}/jobs${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'x-tenant-subdomain': subdomain || '',
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache job listings
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
    console.error('[Jobs Proxy] Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Proxy request failed' },
      { status: 500 }
    );
  }
}

