'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, ZoomIn, ZoomOut, FileText, AlertCircle } from 'lucide-react';
import { getFileUrl } from '@/lib/config';

interface ResumeViewerProps {
  resumePath: string;
  resumeFilename: string;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ resumePath, resumeFilename }) => {
  const [zoom, setZoom] = useState(100);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use getFileUrl to construct the proper API URL
        const fileUrl = getFileUrl(`/api/v1/files/resume/${resumeFilename}`);
        const token = localStorage.getItem('token');
        
        console.log('Fetching resume from:', fileUrl);
        console.log('Has token:', !!token);
        
        const response = await fetch(fileUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch resume: ${response.status} ${response.statusText}`);
        }

        // Create a blob URL for the PDF
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err: any) {
        console.error('Error fetching resume:', err);
        console.error('Error details:', {
          resumeFilename,
          message: err.message
        });
        setError(err.message || 'Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    if (resumeFilename) {
      fetchResume();
    }

    // Cleanup blob URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [resumeFilename]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Resume</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={loading}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 w-16 text-center">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={loading}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={!pdfUrl}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-auto bg-gray-50" style={{ maxHeight: '90vh', minHeight: '800px' }}>
          {loading && (
            <div className="flex items-center justify-center h-[800px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading resume...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center h-[800px]">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium">Error loading resume</p>
                <p className="text-gray-600 text-sm mt-2">{error}</p>
              </div>
            </div>
          )}
          
          {pdfUrl && !loading && !error && (
            <iframe
              src={pdfUrl}
              className="w-full"
              style={{ height: `${zoom}%`, minHeight: '1000px' }}
              title="Resume Viewer"
            />
          )}
          
          {!pdfUrl && !loading && !error && (
            <div className="flex items-center justify-center h-[800px]">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No resume available</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { ResumeViewer };
