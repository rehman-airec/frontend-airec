'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Upload, FileText, X } from 'lucide-react';

interface AttachmentsCardProps {
  attachments: File[];
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (index: number) => void;
}

export const AttachmentsCard: React.FC<AttachmentsCardProps> = ({
  attachments,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onRemoveAttachment,
}) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Upload className="h-5 w-5 mr-2 text-purple-600" />
          Attachments
        </h3>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-500 mb-4">
          Attachments are visible only to the selected attendees.
        </p>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
          }`}
          onClick={() => document.getElementById('file-upload')?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <Upload className={`h-6 w-6 mx-auto mb-2 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-600 mb-2">
            {isDragOver ? 'Drop files here' : 'Click here to upload files or drag and drop'}
          </p>
          <input
            type="file"
            multiple
            onChange={onFileSelect}
            accept="*/*"
            className="hidden"
            id="file-upload"
          />
          <Button 
            variant="outline" 
            size="sm" 
            type="button" 
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              document.getElementById('file-upload')?.click();
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Click here to choose files
          </Button>
        </div>

        {attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                <span className="text-sm text-gray-700">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveAttachment(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

