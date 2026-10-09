import React from 'react';
import { Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { formatFileSize } from './FileDropZone';

interface DownloadButtonProps {
  onDownload: () => void;
  onReset: () => void;
  fileName: string;
  fileSizeBytes?: number;
  label?: string;
}

export default function DownloadButton({
  onDownload,
  onReset,
  fileName,
  fileSizeBytes,
  label = 'Download Processed File',
}: DownloadButtonProps) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 text-center space-y-5">
      <div className="flex flex-col items-center justify-center gap-1.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-1">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h4 className="text-base sm:text-lg font-bold text-slate-900">
          Your Document is Ready!
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 font-mono">
          {fileName}
          {fileSizeBytes !== undefined && ` (${formatFileSize(fileSizeBytes)})`}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onDownload}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-md hover:bg-orange-700 hover:shadow-lg transition-all cursor-pointer active:scale-95"
        >
          <Download className="h-5 w-5" />
          <span>{label}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm sm:text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Process Another File</span>
        </button>
      </div>

      <p className="text-xs text-slate-500">
        🔒 Generated locally in your browser. Nothing was uploaded.
      </p>
    </div>
  );
}
