'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileCheck,
  RefreshCw,
  Download,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import {
  detectFileType,
  getAvailableOperations,
  QUALITY_PRESETS,
  ConversionQuality,
  ConversionOperation,
  DetectedFileType,
} from '@/lib/conversion-registry';
import ToolLogo from './ToolLogo';

export default function UniversalConverter({
  className = '',
  onClose,
}: {
  className?: string;
  onClose?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<DetectedFileType | null>(null);
  const [availableOps, setAvailableOps] = useState<ConversionOperation[]>([]);
  const [selectedOpId, setSelectedOpId] = useState<string>('');
  const [quality, setQuality] = useState<ConversionQuality>('medium');

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFilename, setResultFilename] = useState<string>('');
  const [resultSize, setResultSize] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Auto-detect file type when a file is selected
  useEffect(() => {
    if (!file) {
      setFileType(null);
      setAvailableOps([]);
      setSelectedOpId('');
      return;
    }

    let active = true;
    detectFileType(file).then((detected) => {
      if (!active) return;
      setFileType(detected);

      if (detected.category === 'unknown') {
        setError(
          `Unsupported file format (${file.name}). Please upload a valid PDF, Word (.docx/.doc), Excel (.xlsx/.xls), PowerPoint (.pptx/.ppt), or Image (.jpg/.png/.webp) file.`
        );
        setAvailableOps([]);
        setSelectedOpId('');
      } else {
        setError(null);
        const ops = getAvailableOperations(detected);
        setAvailableOps(ops);
        if (ops.length > 0) {
          setSelectedOpId(ops[0].id);
        }
      }
    });

    return () => {
      active = false;
    };
  }, [file]);

  const handleFileChange = (newFile: File) => {
    setError(null);
    setResultBlob(null);
    setProgress(0);
    setStatusText('');
    setFile(newFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileType(null);
    setAvailableOps([]);
    setSelectedOpId('');
    setResultBlob(null);
    setResultFilename('');
    setResultSize(0);
    setError(null);
    setProgress(0);
    setStatusText('');
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateProgress = (p: number, msg: string) => {
    setProgress(p);
    setStatusText(msg);
  };

  const handleConvert = async () => {
    if (!file || !fileType || !selectedOpId) {
      setError('Please select a document and conversion operation first.');
      return;
    }

    setIsProcessing(true);
    setProgress(5);
    setStatusText('Preparing client-side conversion engine...');
    setError(null);
    setResultBlob(null);

    const baseName = file.name.replace(/\.[^/.]+$/, '');

    try {
      let outputBlob: Blob | null = null;
      let outName = '';

      switch (selectedOpId) {
        case 'pdf-to-word': {
          const { pdfToWord } = await import('@/lib/pdf/pdf-to-word');
          outputBlob = await pdfToWord(file, quality, updateProgress);
          outName = `${baseName}.docx`;
          break;
        }

        case 'word-to-pdf': {
          const { wordToPdf } = await import('@/lib/pdf/word-to-pdf');
          outputBlob = await wordToPdf(file, quality, updateProgress);
          outName = `${baseName}.pdf`;
          break;
        }

        case 'pdf-to-excel': {
          const { pdfToExcel } = await import('@/lib/pdf/pdf-to-excel');
          outputBlob = await pdfToExcel(file, quality, updateProgress);
          outName = `${baseName}.xlsx`;
          break;
        }

        case 'excel-to-pdf': {
          const { excelToPdf } = await import('@/lib/pdf/excel-to-pdf');
          outputBlob = await excelToPdf(file, updateProgress);
          outName = `${baseName}.pdf`;
          break;
        }

        case 'pdf-to-powerpoint': {
          const { pdfToPptx } = await import('@/lib/pdf/pdf-to-pptx');
          outputBlob = await pdfToPptx(file, updateProgress);
          outName = `${baseName}.pptx`;
          break;
        }

        case 'powerpoint-to-pdf': {
          const { pptxToPdf } = await import('@/lib/pdf/pptx-to-pdf');
          outputBlob = await pptxToPdf(file, updateProgress);
          outName = `${baseName}.pdf`;
          break;
        }

        case 'pdf-to-jpg': {
          const { pdfToImage } = await import('@/lib/pdf/pdf-to-image');
          const scale = quality === 'low' ? 1.2 : quality === 'medium' ? 1.8 : 2.5;
          const qVal = quality === 'low' ? 0.6 : quality === 'medium' ? 0.82 : 0.95;
          const blobs = await pdfToImage(file, { format: 'image/jpeg', scale, quality: qVal }, updateProgress);
          if (blobs.length > 0) {
            outputBlob = blobs[0];
            outName = `${baseName}-page1.jpg`;
          }
          break;
        }

        case 'pdf-to-png': {
          const { pdfToImage } = await import('@/lib/pdf/pdf-to-image');
          const scale = quality === 'low' ? 1.2 : quality === 'medium' ? 1.8 : 2.5;
          const blobs = await pdfToImage(file, { format: 'image/png', scale }, updateProgress);
          if (blobs.length > 0) {
            outputBlob = blobs[0];
            outName = `${baseName}-page1.png`;
          }
          break;
        }

        case 'image-to-pdf': {
          const { imagesToPdf } = await import('@/lib/pdf/image-to-pdf');
          outputBlob = await imagesToPdf([file], updateProgress);
          outName = `${baseName}.pdf`;
          break;
        }

        case 'compress-pdf': {
          const { compressPdf } = await import('@/lib/pdf/compress');
          outputBlob = await compressPdf(file, quality, updateProgress);
          outName = `compressed-${file.name}`;
          break;
        }

        case 'translate-pdf': {
          const { translatePdf } = await import('@/lib/pdf/translate');
          outputBlob = await translatePdf(file, 'es', updateProgress);
          outName = `translated-${file.name}`;
          break;
        }

        case 'split-pdf': {
          const { splitPdf } = await import('@/lib/pdf/split');
          const blobs = await splitPdf(file, updateProgress);
          if (blobs.length > 0) {
            outputBlob = blobs[0];
            outName = `page-1-${file.name}`;
          }
          break;
        }

        case 'rotate-pdf': {
          const { rotatePdf } = await import('@/lib/pdf/rotate');
          outputBlob = await rotatePdf(file, 90, updateProgress);
          outName = `rotated-${file.name}`;
          break;
        }

        case 'protect-pdf': {
          const { protectPdf } = await import('@/lib/pdf/protect');
          outputBlob = await protectPdf(file, 'Protected@123', updateProgress);
          outName = `protected-${file.name}`;
          break;
        }

        default:
          throw new Error(`Unsupported conversion operation: ${selectedOpId}`);
      }

      if (!outputBlob || outputBlob.size === 0) {
        throw new Error('Generated output file is empty or corrupted.');
      }

      setResultBlob(outputBlob);
      setResultFilename(outName);
      setResultSize(outputBlob.size);
      setProgress(100);
      setStatusText('Conversion complete! File ready for download.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const selectedOp = availableOps.find((op) => op.id === selectedOpId);

  return (
    <div
      className={`rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-mono font-bold text-blue-700 border border-blue-200 mb-1.5">
            <Sparkles className="h-3 w-3 text-blue-600" />
            <span>UNIVERSAL CONVERTER WORKSPACE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950">
            Convert Any Supported File Online
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Upload PDF, Word, Excel, PowerPoint, or Images. Auto-detects format and applies quality presets.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="self-start sm:self-auto text-xs font-bold text-zinc-400 hover:text-zinc-700"
          >
            ✕ Close
          </button>
        )}
      </div>

      {/* STEP 1: Upload Zone (If no file yet) */}
      {!file && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-blue-600 bg-blue-50/70 scale-99'
              : 'border-zinc-300 hover:border-blue-500 hover:bg-zinc-50/80 bg-zinc-50/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.jpg,.jpeg,.png,.webp"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileChange(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 mb-4">
            <Upload className="h-8 w-8" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-zinc-900">
            Choose a file or drag & drop here
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 max-w-md">
            Supports PDF, Microsoft Word (.docx, .doc), Excel (.xlsx), PowerPoint (.pptx), JPG, PNG, and WebP.
          </p>

          <button
            type="button"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-blue-500 transition-colors uppercase tracking-wider"
          >
            <span>Select File from Computer</span>
          </button>

          <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            <span>100% Client-Side RAM · Zero File Uploads</span>
          </div>
        </div>
      )}

      {/* STEP 2 to 5: File Uploaded Workspace */}
      {file && (
        <div className="space-y-6">
          {/* File Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 sm:p-5">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="shrink-0">
                <ToolLogo slug={fileType?.iconSlug || 'merge-pdf'} size={44} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm sm:text-base font-bold text-zinc-900">
                    {file.name}
                  </span>
                  {fileType && (
                    <span className="shrink-0 rounded-md bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                      {fileType.label}
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-zinc-400 mt-0.5 block">
                  Original Size: {formatBytes(file.size)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                Replace File
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isProcessing}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                Remove
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.jpg,.jpeg,.png,.webp"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-800">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="font-bold">Conversion Alert</p>
                <p className="mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* STEP 3: Dynamic Conversion Dropdown */}
          {availableOps.length > 0 && !resultBlob && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Select Target Conversion Operation:
                </label>
                <div className="relative">
                  <select
                    value={selectedOpId}
                    onChange={(e) => setSelectedOpId(e.target.value)}
                    disabled={isProcessing}
                    className="w-full appearance-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-bold text-zinc-900 shadow-xs focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 disabled:bg-zinc-100"
                  >
                    {availableOps.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.label} — {op.description}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                    ▼
                  </div>
                </div>
              </div>

              {/* STEP 4: Quality Selection (Phase 3) */}
              {selectedOp?.supportsQuality && (
                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <span className="block text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">
                    Output Quality & Optimization Level:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(['low', 'medium', 'high'] as ConversionQuality[]).map((q) => {
                      const preset = QUALITY_PRESETS[q];
                      const isSelected = quality === q;
                      return (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setQuality(q)}
                          disabled={isProcessing}
                          className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-black text-zinc-900 uppercase">
                              {q} Quality
                            </span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                                isSelected ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600'
                              }`}
                            >
                              {preset.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 leading-tight">
                            {preset.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: Convert Action Button & Progress */}
              <div className="pt-3">
                {!isProcessing ? (
                  <button
                    type="button"
                    onClick={handleConvert}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm sm:text-base font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all uppercase tracking-wider cursor-pointer"
                  >
                    <span>Execute Conversion</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                        <span>{statusText || 'Processing document in local RAM...'}</span>
                      </span>
                      <span className="font-mono">{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-blue-200">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: Result & Download Screen */}
          {resultBlob && (
            <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-zinc-950">
                    Document Converted Successfully!
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Generated file has been verified and is ready to download.
                  </p>
                </div>
              </div>

              {/* File Specs & Real Size Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl bg-white p-3.5 border border-emerald-200 text-xs">
                <div>
                  <span className="text-zinc-400 block font-mono text-[10px] uppercase">
                    Output Filename
                  </span>
                  <span className="font-bold text-zinc-900 truncate block">
                    {resultFilename}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-mono text-[10px] uppercase">
                    Original Size
                  </span>
                  <span className="font-bold text-zinc-700">
                    {formatBytes(file.size)}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-mono text-[10px] uppercase">
                    Output Size ({quality.toUpperCase()})
                  </span>
                  <span className="font-bold text-emerald-700">
                    {formatBytes(resultSize)}
                    {resultSize < file.size && (
                      <span className="ml-1 text-[10px] text-emerald-600 font-mono">
                        (-{Math.round(((file.size - resultSize) / file.size) * 100)}%)
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Download and Reset Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => saveAs(resultBlob, resultFilename)}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all uppercase tracking-wider cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Converted Document</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 text-zinc-400" />
                  <span>Convert Another File</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
