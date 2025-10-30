'use client';

import React from 'react';
import { UploadCloud, FileText } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept?: string;
  onFile: (file: File | null) => void;
  description?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, accept, onFile, description }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    const f = files && files[0] ? files[0] : null;
    setFileName(f ? f.name : null);
    onFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`mt-1 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="button"
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {fileName ? (
              <FileText className="h-6 w-6 text-blue-600" />
            ) : (
              <UploadCloud className="h-6 w-6 text-gray-500" />
            )}
          </div>
          <p className="mt-2 text-sm text-gray-700">
            {fileName ? <span className="font-medium text-gray-900">{fileName}</span> : 'Drag and drop file here, or click to browse'}
          </p>
          {accept && (
            <p className="text-xs text-gray-500">Accepted: {accept.replace(/\//g, ' / ')}</p>
          )}
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>
    </div>
  );
};


