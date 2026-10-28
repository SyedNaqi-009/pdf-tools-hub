'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCw,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  FileArchive,
  FileSpreadsheet,
  Layers,
  Image as ImageIcon,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import Container from '../ui/Container';
import Breadcrumbs from '../layout/Breadcrumbs';
import FAQAccordion from '../ui/FAQAccordion';
import SectionHeading from '../ui/SectionHeading';
import ToolCard from './ToolCard';
import FileDropZone from './FileDropZone';
import ProcessingStatus from './ProcessingStatus';
import DownloadButton from './DownloadButton';
import { ToolItem, getRelatedTools } from '@/lib/tools-data';
import { getToolStructuredData } from '@/lib/seo';
import { ConversionQuality, QUALITY_PRESETS } from '@/lib/conversion-registry';

interface ToolPageLayoutProps {
  tool: ToolItem;
}

export default function ToolPageLayout({ tool }: ToolPageLayoutProps) {
  const relatedTools = getRelatedTools(tool);
  const schemas = getToolStructuredData(tool);

  // Core State
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultBlobs, setResultBlobs] = useState<Blob[]>([]);
  const [resultFilename, setResultFilename] = useState(tool.outputFilename);
  const [quality, setQuality] = useState<ConversionQuality>('medium');

  // Tool Specific Options
  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [pageRange, setPageRange] = useState('1');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [password, setPassword] = useState('');
  const [pageOrder, setPageOrder] = useState('1, 2');
  const [targetLang, setTargetLang] = useState('es');
  const [metadataInfo, setMetadataInfo] = useState<Record<string, string | number> | null>(null);

  // Advanced Options
  const [sheetMode, setSheetMode] = useState<'single' | 'multiple'>('single');
  const [downloadAsZip, setDownloadAsZip] = useState(true);
  const [imageOrientation, setImageOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [imagePageSize, setImagePageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [imageMargin, setImageMargin] = useState<'none' | 'small' | 'standard' | 'large'>('small');
  const [splitMode, setSplitMode] = useState<'all' | 'range' | 'fixed'>('all');
  const [splitFixedCount, setSplitFixedCount] = useState(2);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Signature Canvas
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [, setHasSignature] = useState(false);

  // Preview Viewer State
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [previewPage, setPreviewPage] = useState(1);
  const [previewTotalPages, setPreviewTotalPages] = useState(1);
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);

  // Form Fields State
  const [detectedFields, setDetectedFields] = useState<string[]>([]);
  const [formFieldValues, setFormFieldValues] = useState<Record<string, string>>({});

  const cancelControllerRef = useRef<AbortController | null>(null);

  // Reset tool state
  const handleReset = () => {
    if (cancelControllerRef.current) {
      cancelControllerRef.current.abort();
    }
    setFiles([]);
    setIsProcessing(false);
    setProgress(0);
    setStatusText('');
    setError(null);
    setResultBlob(null);
    setResultBlobs([]);
    setMetadataInfo(null);
    setDetectedFields([]);
    setFormFieldValues({});
    setHasSignature(false);
    setPreviewImageSrc(null);
  };

  const handleCancel = () => {
    if (cancelControllerRef.current) {
      cancelControllerRef.current.abort();
    }
    setIsProcessing(false);
    setProgress(0);
    setStatusText('Cancelled by user.');
    setError('Operation cancelled by user.');
  };

  const updateProgress = (p: number, msg: string) => {
    if (cancelControllerRef.current?.signal.aborted) {
      throw new Error('Operation cancelled by user.');
    }
    setProgress(p);
    setStatusText(msg);
  };

  // Helper to parse comma / dash ranges
  const parsePageNumbers = (str: string): number[] => {
    const list: number[] = [];
    const parts = str.split(',').map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) list.push(i);
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num)) list.push(num);
      }
    }
    return Array.from(new Set(list));
  };

  // Drawing Canvas Listeners for Signature Tool
  useEffect(() => {
    if (tool.slug !== 'sign-pdf' || !sigCanvasRef.current) return;
    const canvas = sigCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [tool.slug, files]);

  const clearSignature = () => {
    if (!sigCanvasRef.current) return;
    const ctx = sigCanvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height);
    setHasSignature(false);
  };

  // Inspect form fields when file uploaded for fill-pdf-forms
  useEffect(() => {
    if (tool.slug !== 'fill-pdf-forms' || files.length === 0) return;
    let active = true;

    async function inspect() {
      try {
        const { getFormFields } = await import('@/lib/pdf/fill-forms');
        const fields = await getFormFields(files[0]);
        if (active) {
          setDetectedFields(fields);
          const initial: Record<string, string> = {};
          fields.forEach((f) => (initial[f] = ''));
          setFormFieldValues(initial);
        }
      } catch {
        // Fallback
      }
    }

    inspect();
    return () => {
      active = false;
    };
  }, [tool.slug, files]);

  // Document Preview Loader for uploaded PDFs and Images
  useEffect(() => {
    if (files.length === 0) {
      setPreviewImageSrc(null);
      return;
    }

    const firstFile = files[0];
    const isPdf = firstFile.type.includes('pdf') || firstFile.name.toLowerCase().endsWith('.pdf');
    const isImage = firstFile.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(firstFile.name);

    if (isImage) {
      const url = URL.createObjectURL(firstFile);
      setPreviewImageSrc(url);
      return () => URL.revokeObjectURL(url);
    }

    if (isPdf) {
      let active = true;
      async function loadPdf() {
        try {
          const { loadPdfPreview, renderPdfPageToCanvas } = await import('@/lib/pdf/preview');
          const info = await loadPdfPreview(firstFile);
          if (active) {
            setPreviewTotalPages(info.numPages);
            setPreviewPage(1);
            if (previewCanvasRef.current) {
              await renderPdfPageToCanvas(firstFile, 1, previewCanvasRef.current, 1.2);
            }
          }
        } catch {
          // Preview fallback
        }
      }
      loadPdf();
      return () => {
        active = false;
      };
    }
  }, [files]);

  // Page Switcher for PDF Preview
  const changePreviewPage = async (newPage: number) => {
    if (files.length === 0 || !previewCanvasRef.current) return;
    if (newPage < 1 || newPage > previewTotalPages) return;
    try {
      const { renderPdfPageToCanvas } = await import('@/lib/pdf/preview');
      setPreviewPage(newPage);
      await renderPdfPageToCanvas(files[0], newPage, previewCanvasRef.current, 1.2);
    } catch {
      // ignore
    }
  };

  // Execute processing
  const handleExecute = async () => {
    if (files.length === 0) {
      setError('Please select or upload a document first.');
      return;
    }

    if (tool.slug === 'delete-pdf-pages') {
      const pages = parsePageNumbers(pageRange);
      if (pages.length > 1 && !deleteConfirm) {
        setDeleteConfirm(true);
        return;
      }
    }

    cancelControllerRef.current = new AbortController();
    setIsProcessing(true);
    setProgress(5);
    setStatusText('Starting client-side operation...');
    setError(null);
    setResultBlob(null);
    setResultBlobs([]);
    setDeleteConfirm(false);

    try {
      switch (tool.slug) {
        case 'merge-pdf': {
          const { mergePdf } = await import('@/lib/pdf/merge');
          const blob = await mergePdf(files, updateProgress);
          setResultBlob(blob);
          setResultFilename('merged-document.pdf');
          break;
        }

        case 'compress-pdf': {
          const { compressPdf } = await import('@/lib/pdf/compress');
          const blob = await compressPdf(files[0], quality, updateProgress);
          setResultBlob(blob);
          setResultFilename(`compressed-${files[0].name}`);
          break;
        }

        case 'split-pdf': {
          const { splitPdf } = await import('@/lib/pdf/split');
          const blobs = await splitPdf(files[0], updateProgress, {
            mode: splitMode,
            pageRange,
            fixedPageCount: splitFixedCount,
          });

          if (blobs.length > 1) {
            updateProgress(95, 'Archiving split documents into ZIP file...');
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();
            blobs.forEach((b, idx) => zip.file(`split-part-${idx + 1}.pdf`, b));
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            setResultBlob(zipBlob);
            setResultBlobs([]);
            setResultFilename(`${files[0].name.replace(/\.[^/.]+$/, '')}-split.zip`);
          } else if (blobs.length === 1) {
            setResultBlob(blobs[0]);
            setResultBlobs([]);
            setResultFilename(`${files[0].name.replace(/\.[^/.]+$/, '')}-part-1.pdf`);
          }
          break;
        }

        case 'rotate-pdf': {
          const { rotatePdf } = await import('@/lib/pdf/rotate');
          const blob = await rotatePdf(files[0], rotationAngle, updateProgress);
          setResultBlob(blob);
          setResultFilename(`rotated-${files[0].name}`);
          break;
        }

        case 'extract-pdf-pages': {
          const { extractPdfPages } = await import('@/lib/pdf/extract');
          const pages = parsePageNumbers(pageRange);
          const blob = await extractPdfPages(files[0], pages, updateProgress);
          setResultBlob(blob);
          setResultFilename(`extracted-${files[0].name}`);
          break;
        }

        case 'delete-pdf-pages': {
          const { deletePdfPages } = await import('@/lib/pdf/delete');
          const pages = parsePageNumbers(pageRange);
          const blob = await deletePdfPages(files[0], pages, updateProgress);
          setResultBlob(blob);
          setResultFilename(`pages-removed-${files[0].name}`);
          break;
        }

        case 'pdf-to-jpg': {
          const { pdfToImage } = await import('@/lib/pdf/pdf-to-image');
          const scale = quality === 'low' ? 1.2 : quality === 'medium' ? 1.8 : 2.5;
          const qVal = quality === 'low' ? 0.6 : quality === 'medium' ? 0.82 : 0.95;
          const blobs = await pdfToImage(
            files[0],
            { format: 'image/jpeg', scale, quality: qVal },
            updateProgress
          );

          if (downloadAsZip && blobs.length > 1) {
            updateProgress(95, 'Packaging JPG pages into ZIP archive...');
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();
            blobs.forEach((b, idx) => zip.file(`page-${idx + 1}.jpg`, b));
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            setResultBlob(zipBlob);
            setResultBlobs([]);
            setResultFilename(`${files[0].name.replace(/\.[^/.]+$/, '')}-images.zip`);
          } else {
            setResultBlobs(blobs);
            if (blobs.length > 0) setResultBlob(blobs[0]);
            setResultFilename('page-1.jpg');
          }
          break;
        }

        case 'pdf-to-png': {
          const { pdfToImage } = await import('@/lib/pdf/pdf-to-image');
          const scale = quality === 'low' ? 1.2 : quality === 'medium' ? 1.8 : 2.5;
          const blobs = await pdfToImage(
            files[0],
            { format: 'image/png', scale },
            updateProgress
          );

          if (downloadAsZip && blobs.length > 1) {
            updateProgress(95, 'Packaging PNG pages into ZIP archive...');
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();
            blobs.forEach((b, idx) => zip.file(`page-${idx + 1}.png`, b));
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            setResultBlob(zipBlob);
            setResultBlobs([]);
            setResultFilename(`${files[0].name.replace(/\.[^/.]+$/, '')}-images.zip`);
          } else {
            setResultBlobs(blobs);
            if (blobs.length > 0) setResultBlob(blobs[0]);
            setResultFilename('page-1.png');
          }
          break;
        }

        case 'jpg-to-pdf':
        case 'png-to-pdf': {
          const { imagesToPdf } = await import('@/lib/pdf/image-to-pdf');
          const blob = await imagesToPdf(files, updateProgress, {
            orientation: imageOrientation,
            pageSize: imagePageSize,
            margin: imageMargin,
          });
          setResultBlob(blob);
          setResultFilename(`${files[0].name.replace(/\.[^/.]+$/, '')}-converted.pdf`);
          break;
        }

        case 'word-to-pdf': {
          const { wordToPdf } = await import('@/lib/pdf/word-to-pdf');
          const blob = await wordToPdf(files[0], quality, updateProgress);
          setResultBlob(blob);
          setResultFilename(`${files[0].name.replace(/\.[^/.]+$/, '')}.pdf`);
          break;
        }

        case 'pdf-to-word': {
          const { pdfToWord } = await import('@/lib/pdf/pdf-to-word');
          const blob = await pdfToWord(files[0], quality, updateProgress);
          setResultBlob(blob);
          setResultFilename(`${files[0].name.replace(/\.[^/.]+$/, '')}.docx`);
          break;
        }

        case 'excel-to-pdf': {
          const { excelToPdf } = await import('@/lib/pdf/excel-to-pdf');
          const blob = await excelToPdf(files[0], updateProgress);
          setResultBlob(blob);
          setResultFilename(`${files[0].name.replace(/\.[^/.]+$/, '')}.pdf`);
          break;
        }

        case 'pdf-to-excel': {
          const { pdfToExcel } = await import('@/lib/pdf/pdf-to-excel');
          const blob = await pdfToExcel(files[0], quality, updateProgress, { sheetMode });
          setResultBlob(blob);
          setResultFilename(`${files[0].name.replace(/\.[^/.]+$/, '')}.xlsx`);
          break;
        }

        case 'powerpoint-to-pdf': {
          const { pptxToPdf } = await import('@/lib/pdf/pptx-to-pdf');
          const blob = await pptxToPdf(files[0], updateProgress);
          setResultBlob(blob);
          setResultFilename(`${files[0].name.replace(/\.[^/.]+$/, '')}.pdf`);
          break;
        }

        case 'pdf-to-powerpoint': {
          const { pdfToPptx } = await import('@/lib/pdf/pdf-to-pptx');
          const blob = await pdfToPptx(files[0], updateProgress);
          setResultBlob(blob);
          setResultFilename(`${files[0].name.replace(/\.[^/.]+$/, '')}.pptx`);
          break;
        }

        case 'pdf-watermark': {
          const { addWatermark } = await import('@/lib/pdf/watermark');
          const blob = await addWatermark(files[0], { text: watermarkText }, updateProgress);
          setResultBlob(blob);
          setResultFilename(`watermarked-${files[0].name}`);
          break;
        }

        case 'protect-pdf': {
          const { protectPdf } = await import('@/lib/pdf/protect');
          const blob = await protectPdf(files[0], password, updateProgress);
          setResultBlob(blob);
          setResultFilename(`protected-${files[0].name}`);
          break;
        }

        case 'unlock-pdf': {
          const { unlockPdf } = await import('@/lib/pdf/unlock');
          const blob = await unlockPdf(files[0], password, updateProgress);
          setResultBlob(blob);
          setResultFilename(`unlocked-${files[0].name}`);
          break;
        }

        case 'sign-pdf': {
          if (!sigCanvasRef.current) throw new Error('Signature pad not found.');
          const dataUrl = sigCanvasRef.current.toDataURL('image/png');
          const { signPdf } = await import('@/lib/pdf/sign');
          const blob = await signPdf(files[0], dataUrl, 0, updateProgress);
          setResultBlob(blob);
          setResultFilename(`signed-${files[0].name}`);
          break;
        }

        case 'pdf-metadata-viewer': {
          const { readPdfMetadata } = await import('@/lib/pdf/metadata');
          const meta = await readPdfMetadata(files[0], updateProgress);
          setMetadataInfo(meta as unknown as Record<string, string | number>);
          const summary = Object.entries(meta)
            .map(([k, v]) => `${k}: ${v}`)
            .join('\n');
          const blob = new Blob([summary], { type: 'text/plain' });
          setResultBlob(blob);
          setResultFilename('pdf-metadata-report.txt');
          break;
        }

        case 'pdf-metadata-remover': {
          const { removePdfMetadata } = await import('@/lib/pdf/metadata');
          const blob = await removePdfMetadata(files[0], updateProgress);
          setResultBlob(blob);
          setResultFilename(`sanitized-${files[0].name}`);
          break;
        }

        case 'organize-pdf': {
          const { organizePdfPages } = await import('@/lib/pdf/organize');
          const order = parsePageNumbers(pageOrder);
          const blob = await organizePdfPages(files[0], order, updateProgress);
          setResultBlob(blob);
          setResultFilename(`reordered-${files[0].name}`);
          break;
        }

        case 'pdf-thumbnail-generator': {
          const { generatePdfThumbnail } = await import('@/lib/pdf/thumbnail');
          const page = parseInt(pageRange, 10) || 1;
          const blob = await generatePdfThumbnail(files[0], page, 600, updateProgress);
          setResultBlob(blob);
          setResultFilename(`thumbnail-page-${page}.png`);
          break;
        }

        case 'fill-pdf-forms': {
          const { fillPdfForms } = await import('@/lib/pdf/fill-forms');
          const blob = await fillPdfForms(files[0], formFieldValues, updateProgress);
          setResultBlob(blob);
          setResultFilename(`filled-${files[0].name}`);
          break;
        }

        case 'pdf-preview': {
          setResultBlob(files[0]);
          setResultFilename(files[0].name);
          updateProgress(100, 'Document preview active.');
          break;
        }

        case 'translate-pdf': {
          const { translatePdf } = await import('@/lib/pdf/translate');
          const blob = await translatePdf(files[0], targetLang, updateProgress);
          setResultBlob(blob);
          setResultFilename(`translated-${targetLang}-${files[0].name}`);
          break;
        }

        default:
          throw new Error(`Tool processor for "${tool.slug}" is not configured.`);
      }

      setIsProcessing(false);
      setProgress(100);
      setStatusText('Processing completed successfully.');
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(msg);
      setStatusText('Failed to process document.');
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    saveAs(resultBlob, resultFilename);
  };

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="min-h-screen bg-zinc-50 pb-24">
        {/* Studio Workspace Header Hero */}
        <div className="border-b border-zinc-900 bg-zinc-950 text-white py-10 sm:py-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-studio-grid opacity-20 pointer-events-none" />
          <Container className="relative">
            <Breadcrumbs
              items={[
                { label: 'PDF TOOLS', href: '/tools' },
                { label: tool.name },
              ]}
              className="mb-6 text-zinc-400"
            />

            <div className="max-w-4xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-blue-950/80 px-2.5 py-1 text-[11px] font-mono font-bold text-blue-400 border border-blue-900/60 uppercase">
                  {tool.categoryLabel}
                </span>
                <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-[11px] font-mono text-zinc-400 border border-zinc-800">
                  .{tool.outputExtension.toUpperCase()} OUTPUT
                </span>
                <span className="rounded-md bg-emerald-950/60 px-2.5 py-1 text-[11px] font-mono text-emerald-400 border border-emerald-900/60 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  100% IN-BROWSER MEMORY
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {tool.actionTitle}
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl">
                {tool.intro}
              </p>
            </div>
          </Container>
        </div>

        {/* Interactive Workspace Workstation */}
        <Container className="py-10 sm:py-14">
          {files.length === 0 ? (
            /* Upload Screen: Full Width Drop Zone */
            <div className="mx-auto max-w-4xl">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-lg shadow-zinc-950/5 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 text-xs font-mono text-zinc-500">
                  <span className="font-bold text-zinc-900 uppercase">
                    STUDIO WORKSPACE // {tool.slug.toUpperCase()}
                  </span>
                  <span>MAX 100MB · ZERO SERVER UPLOADS</span>
                </div>

                <FileDropZone
                  files={files}
                  onFilesChange={(newFiles) => {
                    setFiles(newFiles);
                    setResultBlob(null);
                    setResultBlobs([]);
                    setError(null);
                  }}
                  acceptedFileTypes={tool.acceptedFileTypes}
                  acceptDescription={tool.acceptDescription}
                  allowMultiple={tool.allowMultiple}
                  disabled={isProcessing}
                />
              </div>
            </div>
          ) : (
            /* Active Studio: 2-Column Responsive Desktop Grid (Sticky Settings Left, Preview Right) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Controls & Settings (lg:col-span-5) */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
                <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-md shadow-zinc-950/5 space-y-5">
                  
                  {/* Workspace Status Bar */}
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <span className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-600" />
                      Parameters & Options
                    </span>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs font-mono font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      Clear File
                    </button>
                  </div>

                  {/* Quality Presets */}
                  {['compress-pdf', 'pdf-to-word', 'word-to-pdf', 'pdf-to-excel', 'excel-to-pdf', 'pdf-to-jpg', 'pdf-to-png', 'jpg-to-pdf', 'png-to-pdf', 'pdf-to-powerpoint', 'powerpoint-to-pdf'].includes(tool.slug) && (
                    <div className="space-y-2 pb-4 border-b border-zinc-100">
                      <span className="text-xs font-bold text-zinc-700 uppercase font-mono block">
                        Output Quality & Compression:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {(['low', 'medium', 'high'] as ConversionQuality[]).map((q) => {
                          const preset = QUALITY_PRESETS[q];
                          const isSelected = quality === q;
                          return (
                            <button
                              key={q}
                              type="button"
                              onClick={() => setQuality(q)}
                              className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600'
                                  : 'border-zinc-200 bg-white hover:border-zinc-300'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[11px] font-black text-zinc-900 uppercase">
                                  {q}
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-500 block truncate">
                                {preset.badge}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* PDF to Excel: Worksheet Structure Option */}
                  {tool.slug === 'pdf-to-excel' && (
                    <div className="space-y-2 pb-4 border-b border-zinc-100">
                      <label className="text-xs font-bold text-zinc-700 uppercase font-mono block">
                        Worksheet Arrangement:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSheetMode('single')}
                          className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                            sheetMode === 'single'
                              ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <span className="text-xs font-bold text-zinc-900 block">Single Sheet</span>
                          <span className="text-[11px] text-zinc-500">All pages consolidated</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSheetMode('multiple')}
                          className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                            sheetMode === 'multiple'
                              ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <span className="text-xs font-bold text-zinc-900 block">Multiple Sheets</span>
                          <span className="text-[11px] text-zinc-500">1 sheet per PDF page</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PDF to JPG / PDF to PNG: ZIP Option */}
                  {(tool.slug === 'pdf-to-jpg' || tool.slug === 'pdf-to-png') && (
                    <div className="space-y-2 pb-4 border-b border-zinc-100">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-800">
                        <input
                          type="checkbox"
                          checked={downloadAsZip}
                          onChange={(e) => setDownloadAsZip(e.target.checked)}
                          className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Download pages bundled in a single ZIP archive</span>
                      </label>
                      <p className="text-[11px] text-zinc-500 font-mono">
                        Provides a single-click download for all converted page images.
                      </p>
                    </div>
                  )}

                  {/* JPG to PDF / PNG to PDF Options */}
                  {(tool.slug === 'jpg-to-pdf' || tool.slug === 'png-to-pdf') && (
                    <div className="space-y-4 pb-4 border-b border-zinc-100">
                      <div>
                        <label className="text-xs font-bold text-zinc-700 uppercase font-mono block mb-1.5">
                          Page Orientation:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['auto', 'portrait', 'landscape'] as const).map((ori) => (
                            <button
                              key={ori}
                              type="button"
                              onClick={() => setImageOrientation(ori)}
                              className={`py-2 text-xs font-bold font-mono rounded-lg border capitalize cursor-pointer ${
                                imageOrientation === ori
                                  ? 'bg-zinc-950 text-white border-zinc-950'
                                  : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                              }`}
                            >
                              {ori}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-zinc-700 uppercase font-mono block mb-1">
                            Paper Size:
                          </label>
                          <select
                            value={imagePageSize}
                            onChange={(e) => setImagePageSize(e.target.value as any)}
                            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900"
                          >
                            <option value="a4">A4 Standard</option>
                            <option value="letter">US Letter</option>
                            <option value="fit">Fit to Image Size</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-zinc-700 uppercase font-mono block mb-1">
                            Margins:
                          </label>
                          <select
                            value={imageMargin}
                            onChange={(e) => setImageMargin(e.target.value as any)}
                            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900"
                          >
                            <option value="none">No Margin (0)</option>
                            <option value="small">Small (0.25")</option>
                            <option value="standard">Standard (0.5")</option>
                            <option value="large">Large (0.75")</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Split PDF Mode Options */}
                  {tool.slug === 'split-pdf' && (
                    <div className="space-y-3 pb-4 border-b border-zinc-100">
                      <label className="text-xs font-bold text-zinc-700 uppercase font-mono block">
                        Split Mode:
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          onClick={() => setSplitMode('all')}
                          className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                            splitMode === 'all'
                              ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <span className="text-xs font-bold text-zinc-900 block">Extract All Pages</span>
                          <span className="text-[11px] text-zinc-500">Every single page saved into individual PDFs</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSplitMode('range')}
                          className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                            splitMode === 'range'
                              ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <span className="text-xs font-bold text-zinc-900 block">Custom Page Ranges</span>
                          <span className="text-[11px] text-zinc-500">Split by page expressions (e.g. 1-3, 5, 8-10)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSplitMode('fixed')}
                          className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                            splitMode === 'fixed'
                              ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <span className="text-xs font-bold text-zinc-900 block">Fixed Intervals</span>
                          <span className="text-[11px] text-zinc-500">Split into chunks of N pages</span>
                        </button>
                      </div>

                      {splitMode === 'range' && (
                        <div className="pt-2">
                          <label className="text-xs font-bold text-zinc-700 uppercase font-mono block mb-1">
                            Page Ranges (e.g. 1-2, 3-5):
                          </label>
                          <input
                            type="text"
                            value={pageRange}
                            onChange={(e) => setPageRange(e.target.value)}
                            className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-mono text-zinc-900"
                            placeholder="1-2, 3-5"
                          />
                        </div>
                      )}

                      {splitMode === 'fixed' && (
                        <div className="pt-2">
                          <label className="text-xs font-bold text-zinc-700 uppercase font-mono block mb-1">
                            Pages per Document:
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={splitFixedCount}
                            onChange={(e) => setSplitFixedCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-mono text-zinc-900"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rotate PDF Options */}
                  {tool.slug === 'rotate-pdf' && (
                    <div className="space-y-2 pb-4 border-b border-zinc-100">
                      <span className="text-xs font-bold text-zinc-700 uppercase font-mono block">
                        Rotation Direction:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setRotationAngle(90)}
                          className={`p-2.5 rounded-xl text-center text-xs font-bold font-mono border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            rotationAngle === 90
                              ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                              : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                          }`}
                        >
                          <RotateCw className="h-4 w-4" />
                          <span>90° CW</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRotationAngle(270)}
                          className={`p-2.5 rounded-xl text-center text-xs font-bold font-mono border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            rotationAngle === 270
                              ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                              : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                          }`}
                        >
                          <RotateCcw className="h-4 w-4" />
                          <span>90° CCW</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRotationAngle(180)}
                          className={`p-2.5 rounded-xl text-center text-xs font-bold font-mono border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            rotationAngle === 180
                              ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                              : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                          }`}
                        >
                          <RotateCw className="h-4 w-4 transform rotate-90" />
                          <span>180° Flip</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Page Range Inputs (Extract, Delete, Thumbnails) */}
                  {(tool.slug === 'extract-pdf-pages' ||
                    tool.slug === 'delete-pdf-pages' ||
                    tool.slug === 'pdf-thumbnail-generator') && (
                    <div className="space-y-2 pb-4 border-b border-zinc-100">
                      <label className="text-xs font-bold text-zinc-700 uppercase font-mono block">
                        {tool.slug === 'delete-pdf-pages'
                          ? 'Page numbers to delete (e.g. 1, 3, 5-7):'
                          : tool.slug === 'pdf-thumbnail-generator'
                          ? 'Page number for thumbnail render:'
                          : 'Page numbers to extract (e.g. 1, 3, 5-8):'}
                      </label>
                      <input
                        type="text"
                        value={pageRange}
                        onChange={(e) => {
                          setPageRange(e.target.value);
                          setDeleteConfirm(false);
                        }}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs font-mono text-zinc-900 focus:border-zinc-900 focus:outline-hidden"
                        placeholder="e.g. 1, 3, 5-8"
                      />

                      {deleteConfirm && tool.slug === 'delete-pdf-pages' && (
                        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">Confirm Deletion</p>
                            <p className="mt-0.5 text-[11px] text-amber-800">
                              You are about to remove multiple pages. Click "Confirm & Delete" to proceed.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Watermark Stamp */}
                  {tool.slug === 'pdf-watermark' && (
                    <div className="space-y-2 pb-4 border-b border-zinc-100">
                      <label className="text-xs font-bold text-zinc-700 uppercase font-mono block">
                        Watermark Stamp Text:
                      </label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs font-mono text-zinc-900"
                        placeholder="e.g. CONFIDENTIAL or DRAFT"
                      />
                    </div>
                  )}

                  {/* Password Protection */}
                  {(tool.slug === 'protect-pdf' || tool.slug === 'unlock-pdf') && (
                    <div className="space-y-2 pb-4 border-b border-zinc-100">
                      <label className="text-xs font-bold text-zinc-700 uppercase font-mono block">
                        {tool.slug === 'protect-pdf' ? 'Set Document Password:' : 'Current Password:'}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs font-mono text-zinc-900"
                        placeholder="Enter password..."
                      />
                    </div>
                  )}

                  {/* Page Order Reorganize */}
                  {tool.slug === 'organize-pdf' && (
                    <div className="space-y-2 pb-4 border-b border-zinc-100">
                      <label className="text-xs font-bold text-zinc-700 uppercase font-mono block">
                        Target Page Sequence (e.g. 3, 1, 2):
                      </label>
                      <input
                        type="text"
                        value={pageOrder}
                        onChange={(e) => setPageOrder(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs font-mono text-zinc-900"
                        placeholder="3, 1, 2"
                      />
                    </div>
                  )}

                  {/* Signature Pad */}
                  {tool.slug === 'sign-pdf' && (
                    <div className="space-y-2 pb-4 border-b border-zinc-100">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-zinc-700 uppercase font-mono">
                          Draw Signature Canvas:
                        </label>
                        <button
                          type="button"
                          onClick={clearSignature}
                          className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="rounded-xl border border-zinc-300 bg-white p-2">
                        <canvas
                          ref={sigCanvasRef}
                          width={400}
                          height={120}
                          className="w-full h-28 bg-zinc-50 rounded-lg cursor-crosshair touch-none"
                          onMouseDown={(e) => {
                            setIsDrawing(true);
                            setHasSignature(true);
                            const ctx = sigCanvasRef.current?.getContext('2d');
                            const rect = sigCanvasRef.current?.getBoundingClientRect();
                            if (ctx && rect) {
                              ctx.beginPath();
                              ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                            }
                          }}
                          onMouseMove={(e) => {
                            if (!isDrawing) return;
                            const ctx = sigCanvasRef.current?.getContext('2d');
                            const rect = sigCanvasRef.current?.getBoundingClientRect();
                            if (ctx && rect) {
                              ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                              ctx.stroke();
                            }
                          }}
                          onMouseUp={() => setIsDrawing(false)}
                          onMouseLeave={() => setIsDrawing(false)}
                          onTouchStart={(e) => {
                            setIsDrawing(true);
                            setHasSignature(true);
                            const ctx = sigCanvasRef.current?.getContext('2d');
                            const rect = sigCanvasRef.current?.getBoundingClientRect();
                            if (ctx && rect && e.touches[0]) {
                              ctx.beginPath();
                              ctx.moveTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
                            }
                          }}
                          onTouchMove={(e) => {
                            if (!isDrawing) return;
                            const ctx = sigCanvasRef.current?.getContext('2d');
                            const rect = sigCanvasRef.current?.getBoundingClientRect();
                            if (ctx && rect && e.touches[0]) {
                              ctx.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
                              ctx.stroke();
                            }
                          }}
                          onTouchEnd={() => setIsDrawing(false)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Form Fields */}
                  {tool.slug === 'fill-pdf-forms' && (
                    <div className="space-y-3 pb-4 border-b border-zinc-100 max-h-60 overflow-y-auto">
                      <p className="text-xs text-zinc-600 font-mono">
                        {detectedFields.length > 0
                          ? `Found ${detectedFields.length} interactive fields:`
                          : 'No interactive form fields detected.'}
                      </p>
                      {detectedFields.map((field) => (
                        <div key={field} className="space-y-1">
                          <label className="text-[11px] font-semibold text-zinc-700 block truncate">
                            {field}:
                          </label>
                          <input
                            type="text"
                            value={formFieldValues[field] || ''}
                            onChange={(e) =>
                              setFormFieldValues((prev) => ({
                                ...prev,
                                [field]: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900"
                            placeholder={`Enter ${field}...`}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Translation */}
                  {tool.slug === 'translate-pdf' && (
                    <div className="space-y-2 pb-4 border-b border-zinc-100">
                      <label className="text-xs font-bold text-zinc-700 uppercase font-mono block">
                        Target Language:
                      </label>
                      <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-zinc-900"
                      >
                        <option value="es">Spanish (Español)</option>
                        <option value="fr">French (Français)</option>
                        <option value="de">German (Deutsch)</option>
                        <option value="it">Italian (Italiano)</option>
                        <option value="pt">Portuguese (Português)</option>
                        <option value="ru">Russian (Русский)</option>
                        <option value="zh-CN">Chinese (Simplified)</option>
                        <option value="ja">Japanese (日本語)</option>
                        <option value="ko">Korean (한국어)</option>
                        <option value="ar">Arabic (العربية)</option>
                        <option value="hi">Hindi (हिन्दी)</option>
                        <option value="ur">Urdu (اردو)</option>
                        <option value="tr">Turkish (Türkçe)</option>
                        <option value="nl">Dutch (Nederlands)</option>
                      </select>
                    </div>
                  )}

                  {/* Execute Button */}
                  <button
                    type="button"
                    onClick={handleExecute}
                    disabled={isProcessing}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-950/20 hover:bg-blue-500 transition-all cursor-pointer active:scale-98 uppercase tracking-wider disabled:opacity-50"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>
                      {deleteConfirm && tool.slug === 'delete-pdf-pages'
                        ? 'Confirm & Delete Pages'
                        : `Execute ${tool.name}`}
                    </span>
                  </button>

                  {/* Processing Status Bar */}
                  <ProcessingStatus
                    isProcessing={isProcessing}
                    progress={progress}
                    statusText={statusText}
                    error={error}
                    onCancel={handleCancel}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: Document Live Preview & Results (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* File Information Card */}
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                      {tool.slug.includes('excel') ? (
                        <FileSpreadsheet className="h-5 w-5" />
                      ) : tool.slug.includes('jpg') || tool.slug.includes('png') ? (
                        <ImageIcon className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-900 truncate">{files[0].name}</p>
                      <p className="text-[11px] font-mono text-zinc-500">
                        {(files[0].size / 1024 / 1024).toFixed(2)} MB · {files.length} file(s)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-mono font-bold text-zinc-500 hover:text-zinc-800"
                  >
                    Replace
                  </button>
                </div>

                {/* Download CTA Card (When Ready) */}
                {resultBlob && (
                  <div className="rounded-3xl border border-emerald-300 bg-emerald-50/50 p-6 shadow-md shadow-emerald-950/5 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase font-mono">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Document Processing Finished</span>
                    </div>

                    <DownloadButton
                      onDownload={handleDownload}
                      onReset={handleReset}
                      fileName={resultFilename}
                      fileSizeBytes={resultBlob.size}
                      originalSizeBytes={files[0]?.size}
                      label={
                        resultFilename.endsWith('.zip')
                          ? 'Download Archived Package (.ZIP)'
                          : `Download ${tool.outputExtension.toUpperCase()}`
                      }
                    />
                  </div>
                )}

                {/* Document Live Preview Pane */}
                <div className="rounded-3xl border border-zinc-200 bg-zinc-900 text-white p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Document Live View
                    </span>
                    {previewTotalPages > 1 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-400">
                          {previewPage} / {previewTotalPages}
                        </span>
                        <button
                          type="button"
                          onClick={() => changePreviewPage(previewPage - 1)}
                          disabled={previewPage <= 1}
                          className="p-1 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 disabled:opacity-30 hover:bg-zinc-700"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => changePreviewPage(previewPage + 1)}
                          disabled={previewPage >= previewTotalPages}
                          className="p-1 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 disabled:opacity-30 hover:bg-zinc-700"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center overflow-auto max-h-[560px] bg-zinc-950 p-3 rounded-2xl border border-zinc-800/80">
                    {previewImageSrc ? (
                      <img
                        src={previewImageSrc}
                        alt="Uploaded preview"
                        className="max-h-[500px] w-auto object-contain rounded shadow"
                      />
                    ) : (
                      <canvas ref={previewCanvasRef} className="max-w-full shadow-2xl rounded" />
                    )}
                  </div>
                </div>

                {/* Metadata Summary (If Viewed) */}
                {metadataInfo && (
                  <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono border-b pb-2">
                      Metadata Inspection Results
                    </h4>
                    <div className="divide-y divide-zinc-100 text-xs">
                      {Object.entries(metadataInfo).map(([k, v]) => (
                        <div key={k} className="py-2 flex justify-between gap-4">
                          <span className="font-semibold text-zinc-600 capitalize">{k}</span>
                          <span className="text-zinc-900 font-mono text-right">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Privacy Guarantee Note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-zinc-500 font-mono">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              100% In-Memory Sandbox. Documents never touch external cloud servers.
            </span>
          </div>
        </Container>

        {/* How It Works Section */}
        <section className="py-14 sm:py-20 bg-white border-y border-zinc-200/80">
          <Container>
            <SectionHeading
              title={`How to Use ${tool.name}`}
              subtitle="Execute high-precision document operations directly in your browser without cloud delays."
              badge="STEP-BY-STEP WORKFLOW"
              centered
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {tool.howItWorks.map((step, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl border border-zinc-200 bg-zinc-50/50 p-7 flex flex-col justify-between hover:border-zinc-400 transition-colors"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white font-mono font-bold text-sm mb-5 shadow-sm">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 mb-2">
                      {index === 0 ? 'Select File' : index === 1 ? 'Configure Settings' : 'Instant Save'}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Key Capabilities Matrix */}
        <section className="py-14 sm:py-20 bg-zinc-50">
          <Container>
            <SectionHeading
              title="Engine Capabilities & Security Specs"
              subtitle={`Why engineering teams and privacy-conscious users rely on our client-side ${tool.name} tool.`}
              badge="TECHNICAL ARCHITECTURE"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-5xl">
              {tool.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs hover:border-zinc-300 transition-colors"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-zinc-800 leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ Section */}
        <section className="py-14 sm:py-20 bg-white border-y border-zinc-200/80">
          <Container>
            <SectionHeading
              title="Frequently Asked Questions"
              subtitle={`Everything you need to know about our free, client-side ${tool.name} tool.`}
              badge="DOCUMENTATION & SUPPORT"
              centered
            />
            <div className="max-w-3xl mx-auto">
              <FAQAccordion items={tool.faqs} />
            </div>
          </Container>
        </section>

        {/* Related Companion Tools */}
        {relatedTools.length > 0 && (
          <section className="py-14 sm:py-20 bg-zinc-50">
            <Container>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 mb-2 border border-zinc-800">
                    <span>COMPANION TOOLS</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
                    Related PDF Utilities
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-zinc-600">
                    Seamlessly chain this tool with other browser-powered modules.
                  </p>
                </div>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-1 text-xs font-bold font-mono text-rose-600 hover:text-rose-700 uppercase tracking-wider"
                >
                  <span>All 27 tools directory</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedTools.map((relTool) => (
                  <ToolCard key={relTool.slug} tool={relTool} />
                ))}
              </div>
            </Container>
          </section>
        )}
      </main>
    </>
  );
}
