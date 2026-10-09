import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProcessingStatusProps {
  isProcessing: boolean;
  progress?: number;
  statusText?: string;
  error?: string | null;
}

export default function ProcessingStatus({
  isProcessing,
  progress = 0,
  statusText = 'Processing your document...',
  error = null,
}: ProcessingStatusProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        <div className="flex items-center gap-2 font-semibold">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>Processing Error</span>
        </div>
        <p className="mt-1 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!isProcessing) return null;

  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 text-center space-y-4">
      <div className="flex items-center justify-center gap-2 text-blue-600">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="font-semibold text-slate-800 text-sm sm:text-base">
          {statusText}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
        />
      </div>

      <p className="text-xs text-slate-500">
        Running locally in your browser memory via WebAssembly...
      </p>
    </div>
  );
}
