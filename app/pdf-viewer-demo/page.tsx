'use client';

import React, { useState } from 'react';
import { CvViewer } from '@/components/shared/CvViewer';
import { CvViewerModal } from '@/components/shared/CvViewerModal';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

const PdfViewerDemoPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Example PDF URLs - you can replace these with actual resume URLs
  const samplePdfUrl = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">PDF Viewer Demo</h1>
          <p className="text-gray-600 mt-2">
            Demonstration of the PDF viewer component for viewing candidate CVs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inline PDF Viewer */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Inline PDF Viewer</h2>
                <p className="text-gray-600">PDF viewer embedded directly in the page</p>
              </CardHeader>
              <CardContent>
                <CvViewer
                  fileUrl={samplePdfUrl}
                  fileName="sample-resume.pdf"
                  showControls={true}
                  initialScale={0.8}
                />
              </CardContent>
            </Card>
          </div>

          {/* Modal PDF Viewer */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Modal PDF Viewer</h2>
                <p className="text-gray-600">PDF viewer in a modal overlay</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Click the button below to open the PDF viewer in a modal. This is perfect for 
                  viewing candidate resumes without leaving the current page.
                </p>
                
                <Button onClick={() => setShowModal(true)}>
                  Open PDF in Modal
                </Button>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Features:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Multi-page navigation with Previous/Next buttons</li>
                    <li>• Zoom in/out controls (50% - 300%)</li>
                    <li>• Download functionality</li>
                    <li>• Responsive design</li>
                    <li>• Loading states and error handling</li>
                    <li>• Light modal background with blur effect</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Usage Examples</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">1. Basic Inline Usage</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<CvViewer
  fileUrl="/api/v1/files/resume/filename.pdf"
  fileName="candidate-resume.pdf"
  showControls={true}
  initialScale={1.0}
/>`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">2. Modal Usage</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<CvViewerModal
  isOpen={showCvViewer}
  onClose={() => setShowCvViewer(false)}
  fileUrl="/api/v1/files/resume/filename.pdf"
  fileName="candidate-resume.pdf"
  candidateName="John Doe"
/>`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">3. In Admin Applications</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`const handleViewCv = (application) => {
  const candidateName = \`\${application.candidate?.firstName} \${application.candidate?.lastName}\`;
  setSelectedCv({
    url: \`/api/v1/files/resume/\${application.resumeFilename}\`,
    fileName: application.resumeFilename,
    candidateName,
  });
  setShowCvViewer(true);
};`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal */}
        <CvViewerModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          fileUrl={samplePdfUrl}
          fileName="sample-resume.pdf"
          candidateName="John Doe"
        />
      </div>
    </div>
  );
};

export default PdfViewerDemoPage;
