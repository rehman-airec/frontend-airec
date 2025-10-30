import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get the PDF.js worker file from node_modules
    const workerPath = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
    
    if (!fs.existsSync(workerPath)) {
      return new NextResponse('PDF worker not found', { status: 404 });
    }

    const workerContent = fs.readFileSync(workerPath, 'utf8');

    return new NextResponse(workerContent, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving PDF worker:', error);
    return new NextResponse('Error serving PDF worker', { status: 500 });
  }
}
