'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { cn } from '@/lib/utils';
import { WysiwygEditorProps } from './types';
import { Toolbar } from './components/Toolbar';
import { getEditorExtensions } from './extensions';

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  className,
  error,
  label,
  helperText,
  maxLength,
  minHeight = 120,
  maxHeight = 400,
  readOnly = false,
  disabled = false,
  toolbar = 'full',
  onKeyDown,
}) => {
  const editor = useEditor({
    extensions: getEditorExtensions(),
    content: value,
    editable: !readOnly && !disabled,
    immediatelyRender: false, // Fix SSR hydration issues
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: `min-height: ${minHeight}px; max-height: ${maxHeight}px; overflow-y: auto;`,
        'data-placeholder': placeholder,
      },
    },
  });

  // Update editor content when value changes externally
  React.useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Handle character limit
  React.useEffect(() => {
    if (editor && maxLength) {
      const textContent = editor.getText();
      if (textContent.length > maxLength) {
        // Prevent further input if limit exceeded
        editor.setEditable(false);
        setTimeout(() => editor.setEditable(!readOnly && !disabled), 100);
      }
    }
  }, [editor, maxLength, readOnly, disabled]);

  // Get character count for display
  const getCharacterCount = () => {
    if (!editor) return 0;
    return editor.getText().length;
  };

  const characterCount = getCharacterCount();

  // Show loading state during SSR
  if (!editor) {
    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {maxLength && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        )}
        <div className="border rounded-lg overflow-hidden">
          <div className="h-32 bg-gray-100 animate-pulse flex items-center justify-center">
            <span className="text-gray-500">Loading editor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {maxLength && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}
      
      <div className={cn(
        'border rounded-lg overflow-hidden transition-colors',
        error ? 'border-red-500' : 'border-gray-300 focus-within:border-blue-500',
        disabled && 'bg-gray-50 cursor-not-allowed'
      )}>
        <Toolbar editor={editor} type={toolbar} />
        <div onKeyDown={onKeyDown}>
          <EditorContent 
            editor={editor}
            className={cn(
              'p-4',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          />
        </div>
      </div>

      {/* Character count and helper text */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div>
          {error && (
            <span className="text-red-600">{error}</span>
          )}
          {!error && helperText && (
            <span>{helperText}</span>
          )}
        </div>
        {maxLength && (
          <span className={cn(
            'font-medium',
            characterCount > maxLength * 0.9 ? 'text-orange-500' : '',
            characterCount >= maxLength ? 'text-red-500' : ''
          )}>
            {characterCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export { WysiwygEditor };
