'use client';

import React, { useState, useEffect } from 'react';
import { Download, FileText, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import api from '@/lib/axios';

interface CvViewerProps {
  fileUrl: string;
  fileName?: string;
  className?: string;
  showControls?: boolean;
  initialScale?: number;
}

const CvViewer: React.FC<CvViewerProps> = ({
  fileUrl,
  fileName = 'CV',
  className = '',
  showControls = true,
}) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the PDF using direct fetch with authentication
        const token = localStorage.getItem('token');
        
        console.log('Fetching PDF with URL:', fileUrl);
        console.log('Has token:', !!token);
        
        const response = await fetch(fileUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();

        // Create a blob URL from the response
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);
      } catch (err: any) {
        console.error('Error fetching PDF:', err);
        console.error('Error details:', {
          fileUrl,
          message: err.message
        });
        setError(err.message || 'Failed to load PDF');
      } finally {
        setLoading(false);
      }
    };

    if (fileUrl) {
      fetchPdf();
    }
  }, [fileUrl]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  const handleDownload = () => {
    if (pdfBlobUrl) {
      const link = document.createElement('a');
      link.href = pdfBlobUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewInNewTab = () => {
    if (pdfBlobUrl) {
      window.open(pdfBlobUrl, '_blank');
    }
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-0">
        {/* Controls bar */}
        {showControls && (
          <div className="flex justify-end items-center p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex space-x-2">
              <Button
                onClick={handleViewInNewTab}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open in New Tab
              </Button>
              
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        )}
        
        {/* PDF Viewer */}
        <div className="w-full" style={{ height: '70vh' }}>
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium">Error loading PDF</p>
                <p className="text-gray-600 text-sm mt-2">{error}</p>
              </div>
            </div>
          )}
          
          {pdfBlobUrl && !loading && !error && (
            <iframe
              src={pdfBlobUrl}
              className="w-full h-full border-0"
              title="CV Viewer"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { CvViewer };
