'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';

interface FileDropZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  acceptedFileTypes: string[];
  acceptDescription: string;
  allowMultiple: boolean;
  maxSizeMB?: number;
  disabled?: boolean;
  buttonLabel?: string;
  dropNoun?: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function FileDropZone({
  files,
  onFilesChange,
  acceptedFileTypes,
  acceptDescription,
  allowMultiple,
  maxSizeMB = 100,
  disabled = false,
  buttonLabel,
  dropNoun,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAddFiles = (incomingList: FileList | File[]) => {
    setErrorMessage(null);
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < incomingList.length; i++) {
      const file = incomingList[i];

      // File size check
      if (file.size > maxSizeBytes) {
        setErrorMessage(`"${file.name}" exceeds the maximum size limit of ${maxSizeMB}MB.`);
        continue;
      }

      // Type check
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      const isAccepted = acceptedFileTypes.some((type) => {
        if (type.startsWith('.')) {
          return ext === type.toLowerCase();
        }
        return file.type === type;
      });

      if (!isAccepted) {
        setErrorMessage(`"${file.name}" is not an accepted format (${acceptDescription}).`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    if (allowMultiple) {
      onFilesChange([...files, ...validFiles]);
    } else {
      onFilesChange([validFiles[0]]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || !e.dataTransfer.files) return;
    validateAndAddFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    validateAndAddFiles(e.target.files);
    e.target.value = '';
  };

  const removeFile = (indexToRemove: number) => {
    onFilesChange(files.filter((_, idx) => idx !== indexToRemove));
  };

  const acceptString = acceptedFileTypes.join(',');

  return (
    <div className="w-full space-y-4">
      {/* iLovePDF-style Select Files Workstation */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex min-h-[220px] sm:min-h-[260px] flex-col items-center justify-center p-8 text-center transition-all ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptString}
          multiple={allowMultiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          aria-label="Upload files"
        />

        {/* Dragging Active Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl border-3 border-dashed border-[#e5322d] bg-white/95 backdrop-blur-xs shadow-2xl">
            <span className="text-xl sm:text-2xl font-bold text-[#e5322d]">
              Drop {dropNoun || 'files'} here
            </span>
          </div>
        )}

        {/* Big Red iLovePDF-style Select Button */}
        <button
          type="button"
          onClick={() => !disabled && inputRef.current?.click()}
          disabled={disabled}
          className="h-16 sm:h-20 px-8 sm:px-14 rounded-2xl bg-[#e5322d] hover:bg-[#d42722] text-white text-xl sm:text-2xl font-bold tracking-tight shadow-xl shadow-red-600/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3 group"
        >
          <span>{buttonLabel || 'Select PDF files'}</span>
        </button>

        <p className="mt-4 text-sm sm:text-base text-zinc-500 font-medium">
          or drop {dropNoun || 'PDFs'} here
        </p>

        <div className="mt-6 flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Shield className="h-3.5 w-3.5 text-emerald-500" />
          <span>{acceptDescription} · 100% In-Browser Memory</span>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider px-1">
            <span>Selected Files ({files.length})</span>
            {allowMultiple && files.length > 1 && (
              <button
                type="button"
                onClick={() => onFilesChange([])}
                className="text-rose-600 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white shadow-xs">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-3 sm:p-3.5 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                    <File className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-zinc-900">{file.name}</p>
                    <p className="text-[11px] text-zinc-400 font-mono">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
