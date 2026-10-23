import React from 'react';
import { Download, RefreshCw, FileCheck } from 'lucide-react';
import { formatFileSize } from './FileDropZone';

interface DownloadButtonProps {
  onDownload: () => void;
  onReset: () => void;
  fileName: string;
  fileSizeBytes?: number;
  originalSizeBytes?: number;
  label?: string;
}

export default function DownloadButton({
  onDownload,
  onReset,
  fileName,
  fileSizeBytes,
  originalSizeBytes,
  label = 'Download Processed File',
}: DownloadButtonProps) {
  const hasSizeComparison =
    originalSizeBytes !== undefined &&
    fileSizeBytes !== undefined &&
    originalSizeBytes > 0;

  const isSmaller = hasSizeComparison && fileSizeBytes! < originalSizeBytes!;
  const savingsPercent = hasSizeComparison
    ? Math.round(((originalSizeBytes! - fileSizeBytes!) / originalSizeBytes!) * 100)
    : 0;

  return (
    <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/40 p-6 sm:p-8 text-center space-y-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 mb-1">
          <FileCheck className="h-7 w-7" />
        </div>
        <h4 className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight">
          Document Successfully Processed!
        </h4>

        {/* File & Size Comparison Card */}
        <div className="w-full max-w-lg rounded-xl bg-white border border-emerald-200/80 p-3.5 shadow-2xs text-xs space-y-2">
          <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-2">
            <span className="font-mono text-zinc-400 text-[10px] uppercase">Output File</span>
            <span className="font-bold text-zinc-900 truncate max-w-[280px]">{fileName}</span>
          </div>

          {hasSizeComparison ? (
            <div className="grid grid-cols-2 gap-2 text-center pt-1 font-mono">
              <div className="rounded-lg bg-zinc-50 p-2 border border-zinc-200/60">
                <span className="text-[10px] text-zinc-400 block uppercase">Input Size</span>
                <span className="font-bold text-zinc-700">{formatFileSize(originalSizeBytes!)}</span>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2 border border-emerald-200/60">
                <span className="text-[10px] text-emerald-600 block uppercase">Output Size</span>
                <span className="font-bold text-emerald-700">
                  {formatFileSize(fileSizeBytes!)}
                  {isSmaller && ` (-${savingsPercent}%)`}
                </span>
              </div>
            </div>
          ) : (
            fileSizeBytes !== undefined && (
              <div className="text-right">
                <span className="text-emerald-700 font-bold font-mono">
                  {formatFileSize(fileSizeBytes)}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
        <button
          type="button"
          onClick={onDownload}
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/20 hover:bg-blue-500 hover:shadow-xl transition-all cursor-pointer active:scale-98 uppercase tracking-wider"
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
          <span>Convert Another</span>
        </button>
      </div>

      <p className="text-[11px] font-mono text-zinc-400">
        🔒 Document generated in local browser RAM. Zero telemetry was transmitted.
      </p>
    </div>
  );
}
