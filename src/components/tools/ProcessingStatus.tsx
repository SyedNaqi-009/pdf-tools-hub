import React from 'react';
import { Loader2, AlertCircle, Cpu } from 'lucide-react';

interface ProcessingStatusProps {
  isProcessing: boolean;
  progress?: number;
  statusText?: string;
  error?: string | null;
  onCancel?: () => void;
}

export default function ProcessingStatus({
  isProcessing,
  progress = 0,
  statusText = 'Processing your document...',
  error = null,
  onCancel,
}: ProcessingStatusProps) {
  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-rose-900">
        <div className="flex items-center gap-2.5 font-bold text-sm">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>Execution Warning / Processing Error</span>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-rose-700 leading-relaxed font-mono">{error}</p>
      </div>
    );
  }

  if (!isProcessing) return null;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-rose-400 min-w-0 pr-3">
          <Loader2 className="h-5 w-5 animate-spin shrink-0" />
          <span className="font-bold text-sm sm:text-base text-white truncate">
            {statusText}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-xs font-bold text-zinc-400">
            {Math.round(progress)}%
          </span>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-rose-400 hover:bg-zinc-800 hover:text-rose-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden ring-1 ring-zinc-700/50">
        <div
          className="bg-gradient-to-r from-rose-600 to-rose-400 h-2 rounded-full transition-all duration-300 shadow-sm shadow-rose-500/50"
          style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1">
        <span className="flex items-center gap-1.5">
          <Cpu className="h-3 w-3 text-emerald-400" />
          WebAssembly Sandbox Execution
        </span>
        <span>0 Bytes Uploaded</span>
      </div>
    </div>
  );
}
