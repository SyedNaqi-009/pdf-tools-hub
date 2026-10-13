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
      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`relative flex min-h-[220px] sm:min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
          isDragging
            ? 'border-rose-600 bg-rose-50/70 scale-[0.99]'
            : 'border-zinc-300 bg-zinc-50/70 hover:border-zinc-900 hover:bg-zinc-100/60'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-md border border-zinc-200 mb-4 transition-transform group-hover:scale-105">
          <UploadCloud className="h-7 w-7" />
        </div>

        <p className="text-base sm:text-lg font-bold text-zinc-900">
          Drop files into the Studio, or <span className="text-rose-600 underline font-extrabold">browse</span>
        </p>
        
        <p className="mt-1 text-xs text-zinc-500 max-w-sm">
          {acceptDescription} · Max {maxSizeMB}MB
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-mono font-medium text-zinc-300">
          <Shield className="h-3 w-3 text-emerald-400" />
          <span>ZERO-UPLOAD SANDBOX · PROCESSED LOCALLY</span>
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
