'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Upload, FileText, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useCVParsingWithAutoFill, ParsedCVData } from '@/hooks/useCVParsing';

const resumeUploadSchema = z.object({
  resume: z.any().refine((file) => file && file.size > 0, 'Resume is required'),
});

type ResumeUploadFormData = z.infer<typeof resumeUploadSchema>;

interface ResumeUploadFormProps {
  onUpload: (file: File) => void;
  onAutoFill?: (data: ParsedCVData) => void;
  isLoading?: boolean;
  uploadedFile?: File | null;
  showAutoFill?: boolean;
}

const ResumeUploadForm: React.FC<ResumeUploadFormProps> = ({
  onUpload,
  onAutoFill,
  isLoading = false,
  uploadedFile,
  showAutoFill = true,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResumeUploadFormData>({
    resolver: zodResolver(resumeUploadSchema),
  });

  // CV parsing with auto-fill
  const { parseCVWithAutoFill, isParsing } = useCVParsingWithAutoFill(
    useCallback((data: ParsedCVData) => {
      setIsAutoFilling(true);
      onAutoFill?.(data);
      // Reset auto-fill state after a short delay
      setTimeout(() => setIsAutoFilling(false), 2000);
    }, [onAutoFill])
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFileType(file)) {
        handleFileUpload(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    // Check MIME type
    if (validTypes.includes(file.type)) {
      return true;
    }
    
    // Fallback: check file extension
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    return validExtensions.some(ext => fileName.endsWith(ext));
  };

  const handleFileUpload = async (file: File) => {
    if (!isValidFileType(file)) {
      return;
    }

    // Start upload progress simulation
    simulateUpload(file);

    // Upload file
    onUpload(file);

    // Parse CV for auto-fill if enabled
    if (showAutoFill && onAutoFill) {
      try {
        await parseCVWithAutoFill(file);
      } catch (error) {
        console.error('Auto-fill failed:', error);
      }
    }
  };

  const simulateUpload = (file: File) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const onSubmit = (data: ResumeUploadFormData) => {
    if (data.resume) {
      handleFileUpload(data.resume);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Upload Resume</h2>
            <p className="text-gray-600">Upload your resume in PDF or Word format</p>
          </div>
          {showAutoFill && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <Sparkles className="h-4 w-4" />
              <span>Auto-fill enabled</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!uploadedFile ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                {...register('resume')}
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your resume here, or{' '}
                    <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                      browse
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF, DOC, DOCX, or TXT files up to 10MB
                  </p>
                  {showAutoFill && (
                    <p className="text-sm text-blue-600 mt-2 font-medium">
                      ✨ Fields will be auto-filled from your resume
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{uploadedFile.name}</h3>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {isParsing || isAutoFilling ? (
                    <>
                      <div className="h-5 w-5 rounded-full bg-blue-600 animate-pulse opacity-75" />
                      <span className="text-sm text-blue-600 font-medium">
                        {isAutoFilling ? 'Auto-filling...' : 'Parsing...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Uploaded</span>
                    </>
                  )}
                </div>
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {isAutoFilling && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800 font-medium">
                      Automatically filling form fields from your resume...
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {errors.resume && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{String(errors.resume?.message || '')}</span>
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p>Supported formats: PDF, DOC, DOCX, TXT</p>
            <p>Maximum file size: 10MB</p>
            {showAutoFill && (
              <p className="text-blue-600 font-medium">
                ✨ Resume parsing will automatically fill your information
              </p>
            )}
          </div>

          {!uploadedFile && (
            <div className="flex justify-end">
              <Button type="submit" loading={isLoading || isParsing}>
                {isParsing ? 'Parsing Resume...' : 'Upload Resume'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export { ResumeUploadForm };