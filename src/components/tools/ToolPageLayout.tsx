'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCw,
  Lock,
  Stamp,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileSearch,
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

  // Tool Specific Options
  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [pageRange, setPageRange] = useState('1');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [password, setPassword] = useState('');
  const [pageOrder, setPageOrder] = useState('1, 2');
  const [metadataInfo, setMetadataInfo] = useState<Record<string, string | number> | null>(null);

  // Signature Canvas
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Preview Viewer State
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [previewPage, setPreviewPage] = useState(1);
  const [previewTotalPages, setPreviewTotalPages] = useState(1);

  // Form Fields State
  const [detectedFields, setDetectedFields] = useState<string[]>([]);
  const [formFieldValues, setFormFieldValues] = useState<Record<string, string>>({});

  // Reset tool state
  const handleReset = () => {
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
  };

  const updateProgress = (p: number, msg: string) => {
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

  // Preview loader
  useEffect(() => {
    if (tool.slug !== 'pdf-preview' || files.length === 0) return;
    let active = true;

    async function load() {
      try {
        const { loadPdfPreview, renderPdfPageToCanvas } = await import('@/lib/pdf/preview');
        const info = await loadPdfPreview(files[0]);
        if (active) {
          setPreviewTotalPages(info.numPages);
          setPreviewPage(1);
          if (previewCanvasRef.current) {
            await renderPdfPageToCanvas(files[0], 1, previewCanvasRef.current);
          }
        }
      } catch (err: unknown) {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load preview.');
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [tool.slug, files]);

  // Change page for preview tool
  const changePreviewPage = async (newPage: number) => {
    if (files.length === 0 || !previewCanvasRef.current) return;
    if (newPage < 1 || newPage > previewTotalPages) return;
    try {
      const { renderPdfPageToCanvas } = await import('@/lib/pdf/preview');
      setPreviewPage(newPage);
      await renderPdfPageToCanvas(files[0], newPage, previewCanvasRef.current);
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

    setIsProcessing(true);
    setProgress(5);
    setStatusText('Starting client-side operation...');
    setError(null);
    setResultBlob(null);
    setResultBlobs([]);

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
          const blob = await compressPdf(files[0], updateProgress);
          setResultBlob(blob);
          setResultFilename(`compressed-${files[0].name}`);
          break;
        }

        case 'split-pdf': {
          const { splitPdf } = await import('@/lib/pdf/split');
          const blobs = await splitPdf(files[0], updateProgress);
          setResultBlobs(blobs);
          if (blobs.length > 0) setResultBlob(blobs[0]);
          setResultFilename(`page-1.pdf`);
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
          const blobs = await pdfToImage(files[0], { format: 'image/jpeg' }, updateProgress);
          setResultBlobs(blobs);
          if (blobs.length > 0) setResultBlob(blobs[0]);
          setResultFilename('page-1.jpg');
          break;
        }

        case 'jpg-to-pdf': {
          const { imagesToPdf } = await import('@/lib/pdf/image-to-pdf');
          const blob = await imagesToPdf(files, updateProgress);
          setResultBlob(blob);
          setResultFilename('images-combined.pdf');
          break;
        }

        case 'pdf-to-png': {
          const { pdfToImage } = await import('@/lib/pdf/pdf-to-image');
          const blobs = await pdfToImage(files[0], { format: 'image/png' }, updateProgress);
          setResultBlobs(blobs);
          if (blobs.length > 0) setResultBlob(blobs[0]);
          setResultFilename('page-1.png');
          break;
        }

        case 'png-to-pdf': {
          const { imagesToPdf } = await import('@/lib/pdf/image-to-pdf');
          const blob = await imagesToPdf(files, updateProgress);
          setResultBlob(blob);
          setResultFilename('png-converted.pdf');
          break;
        }

        case 'word-to-pdf': {
          const { wordToPdf } = await import('@/lib/pdf/word-to-pdf');
          const blob = await wordToPdf(files[0], updateProgress);
          setResultBlob(blob);
          setResultFilename(`${files[0].name.replace(/\.[^/.]+$/, '')}.pdf`);
          break;
        }

        case 'pdf-to-word': {
          const { pdfToWord } = await import('@/lib/pdf/pdf-to-word');
          const blob = await pdfToWord(files[0], updateProgress);
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
          const blob = await pdfToExcel(files[0], updateProgress);
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
          // create a text summary blob
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

        default:
          throw new Error('Action handler not implemented for this tool.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
      saveAs(resultBlob, resultFilename);
    }
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
                <span className="rounded-md bg-rose-950/80 px-2.5 py-1 text-[11px] font-mono font-bold text-rose-400 border border-rose-900/60 uppercase">
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
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-lg shadow-zinc-950/5 space-y-6">
              
              {/* Workspace Top Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 text-xs font-mono text-zinc-500">
                <span className="font-bold text-zinc-900 uppercase">STUDIO WORKSPACE // {tool.slug.toUpperCase()}</span>
                <span>MAX 100MB · ZERO UPLOADS</span>
              </div>

              {/* Step 1: File Drop Zone */}
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

              {/* Step 2: Tool-Specific Option Controls */}
              {files.length > 0 && !resultBlob && !isProcessing && (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider">
                      Configuration & Parameters
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-500">READY TO EXECUTE</span>
                  </div>

                  {/* Rotate PDF Options */}
                  {tool.slug === 'rotate-pdf' && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-zinc-700 uppercase font-mono block">
                        Rotation Angle:
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {[90, 180, 270].map((angle) => (
                          <button
                            key={angle}
                            type="button"
                            onClick={() => setRotationAngle(angle as 90 | 180 | 270)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer ${
                              rotationAngle === angle
                                ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                                : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100 hover:border-zinc-400'
                            }`}
                          >
                            {angle}° Clockwise
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Page Range Inputs (Extract, Delete, Thumbnails) */}
                  {(tool.slug === 'extract-pdf-pages' ||
                    tool.slug === 'delete-pdf-pages' ||
                    tool.slug === 'pdf-thumbnail-generator') && (
                    <div className="space-y-2">
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
                        onChange={(e) => setPageRange(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-mono text-zinc-900 focus:border-zinc-900 focus:outline-hidden"
                        placeholder="e.g. 1, 3, 5-8"
                      />
                    </div>
                  )}

                  {/* Watermark Text */}
                  {tool.slug === 'pdf-watermark' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-700 uppercase font-mono block">
                        Watermark Stamp Text:
                      </label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-mono text-zinc-900 focus:border-zinc-900 focus:outline-hidden"
                        placeholder="e.g. CONFIDENTIAL or DRAFT"
                      />
                    </div>
                  )}

                  {/* Password Protection */}
                  {(tool.slug === 'protect-pdf' || tool.slug === 'unlock-pdf') && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-700 uppercase font-mono block">
                        {tool.slug === 'protect-pdf' ? 'Set Document Password:' : 'Current Password (if protected):'}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-mono text-zinc-900 focus:border-zinc-900 focus:outline-hidden"
                        placeholder="Enter password..."
                      />
                    </div>
                  )}

                  {/* Page Order Reorganize */}
                  {tool.slug === 'organize-pdf' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-700 uppercase font-mono block">
                        Target Page Sequence (e.g. 3, 1, 2, 4):
                      </label>
                      <input
                        type="text"
                        value={pageOrder}
                        onChange={(e) => setPageOrder(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-mono text-zinc-900 focus:border-zinc-900 focus:outline-hidden"
                        placeholder="3, 1, 2"
                      />
                    </div>
                  )}

                  {/* Signature Pad */}
                  {tool.slug === 'sign-pdf' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-zinc-700 uppercase font-mono">
                          Draw Signature Canvas:
                        </label>
                        <button
                          type="button"
                          onClick={clearSignature}
                          className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                        >
                          Clear canvas
                        </button>
                      </div>
                      <div className="rounded-xl border border-zinc-300 bg-white p-2">
                        <canvas
                          ref={sigCanvasRef}
                          width={500}
                          height={160}
                          className="w-full h-36 bg-zinc-50 rounded-lg cursor-crosshair touch-none"
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

                  {/* Interactive Form Fields Detected */}
                  {tool.slug === 'fill-pdf-forms' && (
                    <div className="space-y-3">
                      <p className="text-xs text-zinc-600 font-mono">
                        {detectedFields.length > 0
                          ? `Found ${detectedFields.length} interactive form fields:`
                          : 'No interactive text form fields detected in this document.'}
                      </p>
                      {detectedFields.map((field) => (
                        <div key={field} className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-700 block truncate">
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
                            className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900"
                            placeholder={`Enter ${field}...`}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Primary Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleExecute}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-rose-950/20 hover:bg-rose-500 transition-all cursor-pointer active:scale-98 uppercase tracking-wider"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      <span>Execute {tool.name}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Preview Viewer (Only for pdf-preview) */}
              {tool.slug === 'pdf-preview' && files.length > 0 && (
                <div className="rounded-2xl border border-zinc-300 bg-zinc-950 text-white p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <span className="text-xs font-mono text-zinc-400">
                      Page {previewPage} of {previewTotalPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changePreviewPage(previewPage - 1)}
                        disabled={previewPage <= 1}
                        className="p-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 disabled:opacity-30 hover:bg-zinc-800"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => changePreviewPage(previewPage + 1)}
                        disabled={previewPage >= previewTotalPages}
                        className="p-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 disabled:opacity-30 hover:bg-zinc-800"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center overflow-auto max-h-[520px] bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                    <canvas ref={previewCanvasRef} className="max-w-full shadow-2xl rounded" />
                  </div>
                </div>
              )}

              {/* Metadata Viewer Table */}
              {metadataInfo && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono border-b pb-2">
                    Extracted PDF Metadata Inspection
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

              {/* Progress and Status */}
              <ProcessingStatus
                isProcessing={isProcessing}
                progress={progress}
                statusText={statusText}
                error={error}
              />

              {/* Download CTA Button */}
              {resultBlob && (
                <DownloadButton
                  onDownload={handleDownload}
                  onReset={handleReset}
                  fileName={resultFilename}
                  fileSizeBytes={resultBlob.size}
                  label={`Download ${tool.outputExtension.toUpperCase()}`}
                />
              )}

              {/* Multi-result notice (split, images) */}
              {resultBlobs.length > 1 && (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-700 flex items-center justify-between">
                  <span className="font-mono">Generated {resultBlobs.length} separate page outputs.</span>
                  <button
                    type="button"
                    onClick={() => {
                      resultBlobs.forEach((b, idx) => {
                        saveAs(b, `page-${idx + 1}.${tool.outputExtension}`);
                      });
                    }}
                    className="font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Download all ({resultBlobs.length})
                  </button>
                </div>
              )}
            </div>

            {/* Privacy Guarantee Note */}
            <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-zinc-500 font-mono">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                100% In-Memory Sandbox. Your documents never touch external cloud servers.
              </span>
            </div>
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
                  <span>All 26 tools directory</span>
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
