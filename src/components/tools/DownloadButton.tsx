import React from 'react';
import { Download, RefreshCw, CheckCircle2, FileCheck } from 'lucide-react';
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
    <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/10 p-6 sm:p-8 text-center space-y-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 mb-1">
          <FileCheck className="h-7 w-7" />
        </div>
        <h4 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight">
          Document Successfully Processed!
        </h4>
        <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-zinc-200 px-3 py-1 text-xs font-mono text-zinc-700 shadow-2xs">
          <span className="font-semibold text-zinc-900">{fileName}</span>
          {fileSizeBytes !== undefined && (
            <span className="text-emerald-600 font-bold">({formatFileSize(fileSizeBytes)})</span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
        <button
          type="button"
          onClick={onDownload}
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-rose-950/20 hover:bg-rose-500 hover:shadow-xl transition-all cursor-pointer active:scale-98 uppercase tracking-wider"
        >
          <Download className="h-4.5 w-4.5" />
          <span>{label}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-4 text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:border-zinc-400 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset Studio</span>
        </button>
      </div>

      <p className="text-[11px] font-mono text-zinc-400">
        🔒 Document generated in local RAM sandbox. Zero telemetry was transmitted.
      </p>
    </div>
  );
}
