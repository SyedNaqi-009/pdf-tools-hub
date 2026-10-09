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

      <main className="min-h-screen bg-slate-50/50 pb-20">
        {/* Header Hero Section */}
        <div className="border-b border-slate-200/80 bg-white py-8 sm:py-12">
          <Container>
            <Breadcrumbs
              items={[
                { label: 'PDF Tools', href: '/tools' },
                { label: tool.name },
              ]}
              className="mb-6"
            />

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
                <span>{tool.categoryLabel}</span>
                <span>•</span>
                <span>100% Free & Client-Side</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {tool.actionTitle}
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
                {tool.intro}
              </p>
            </div>
          </Container>
        </div>

        {/* Interactive Workspace */}
        <Container className="py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs space-y-6">
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

              {/* Step 2: Tool-Specific Option Controls (Only shown once file selected) */}
              {files.length > 0 && !resultBlob && !isProcessing && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Options & Settings
                  </h3>

                  {/* Rotate PDF Options */}
                  {tool.slug === 'rotate-pdf' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs sm:text-sm font-semibold text-slate-700">
                        Rotation Angle:
                      </span>
                      {[90, 180, 270].map((angle) => (
                        <button
                          key={angle}
                          type="button"
                          onClick={() => setRotationAngle(angle as 90 | 180 | 270)}
                          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-colors ${
                            rotationAngle === angle
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {angle}° Clockwise
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Page Range Inputs (Extract, Delete, Thumbnails) */}
                  {(tool.slug === 'extract-pdf-pages' ||
                    tool.slug === 'delete-pdf-pages' ||
                    tool.slug === 'pdf-thumbnail-generator') && (
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 block">
                        {tool.slug === 'delete-pdf-pages'
                          ? 'Page numbers to delete (e.g. 1, 3, 5-7):'
                          : tool.slug === 'pdf-thumbnail-generator'
                          ? 'Page number for thumbnail:'
                          : 'Page numbers to extract (e.g. 1, 3, 5-8):'}
                      </label>
                      <input
                        type="text"
                        value={pageRange}
                        onChange={(e) => setPageRange(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
                        placeholder="e.g. 1, 3, 5-8"
                      />
                    </div>
                  )}

                  {/* Watermark Text */}
                  {tool.slug === 'pdf-watermark' && (
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 block">
                        Watermark Text:
                      </label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
                        placeholder="e.g. CONFIDENTIAL or DRAFT"
                      />
                    </div>
                  )}

                  {/* Password Protection */}
                  {(tool.slug === 'protect-pdf' || tool.slug === 'unlock-pdf') && (
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 block">
                        {tool.slug === 'protect-pdf' ? 'Enter Document Password:' : 'Current Password (if known):'}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
                        placeholder="Enter password..."
                      />
                    </div>
                  )}

                  {/* Page Order Reorganize */}
                  {tool.slug === 'organize-pdf' && (
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 block">
                        New Page Sequence (e.g. 3, 1, 2, 4):
                      </label>
                      <input
                        type="text"
                        value={pageOrder}
                        onChange={(e) => setPageOrder(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
                        placeholder="3, 1, 2"
                      />
                    </div>
                  )}

                  {/* Signature Pad */}
                  {tool.slug === 'sign-pdf' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs sm:text-sm font-semibold text-slate-700">
                          Draw Your Signature:
                        </label>
                        <button
                          type="button"
                          onClick={clearSignature}
                          className="text-xs text-red-600 hover:underline cursor-pointer"
                        >
                          Clear pad
                        </button>
                      </div>
                      <div className="rounded-xl border border-slate-300 bg-white p-2">
                        <canvas
                          ref={sigCanvasRef}
                          width={500}
                          height={160}
                          className="w-full h-36 bg-slate-50 rounded-lg cursor-crosshair touch-none"
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
                      <p className="text-xs text-slate-600">
                        {detectedFields.length > 0
                          ? `Detected ${detectedFields.length} interactive form fields. Enter your information below:`
                          : 'No interactive text fields detected in this PDF or form is flattened.'}
                      </p>
                      {detectedFields.map((field) => (
                        <div key={field} className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 block truncate">
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
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
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
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-md hover:bg-blue-700 transition-all cursor-pointer active:scale-98"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      <span>Process {tool.name}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Preview Viewer (Only for pdf-preview) */}
              {tool.slug === 'pdf-preview' && files.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      Page {previewPage} of {previewTotalPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changePreviewPage(previewPage - 1)}
                        disabled={previewPage <= 1}
                        className="p-1.5 rounded-lg border border-slate-300 bg-white disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => changePreviewPage(previewPage + 1)}
                        disabled={previewPage >= previewTotalPages}
                        className="p-1.5 rounded-lg border border-slate-300 bg-white disabled:opacity-40"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center overflow-auto max-h-[500px] border border-slate-200 bg-white p-2 rounded-lg">
                    <canvas ref={previewCanvasRef} className="max-w-full shadow-xs" />
                  </div>
                </div>
              )}

              {/* Metadata Viewer Table */}
              {metadataInfo && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 border-b pb-2">
                    Extracted PDF Metadata
                  </h4>
                  <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {Object.entries(metadataInfo).map(([k, v]) => (
                      <div key={k} className="py-2 flex justify-between gap-4">
                        <span className="font-semibold text-slate-600 capitalize">{k}</span>
                        <span className="text-slate-900 font-mono text-right">{String(v)}</span>
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
                <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-xs text-slate-700 flex items-center justify-between">
                  <span>Generated {resultBlobs.length} separate page outputs.</span>
                  <button
                    type="button"
                    onClick={() => {
                      resultBlobs.forEach((b, idx) => {
                        saveAs(b, `page-${idx + 1}.${tool.outputExtension}`);
                      });
                    }}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Download all ({resultBlobs.length})
                  </button>
                </div>
              )}
            </div>

            {/* Privacy Guarantee Note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Your files are processed entirely in your browser. Nothing is uploaded to any server.
              </span>
            </div>
          </div>
        </Container>

        {/* How It Works Section */}
        <section className="py-12 sm:py-16 bg-white border-y border-slate-200/80">
          <Container>
            <SectionHeading
              title={`How to Use ${tool.name}`}
              subtitle="Process your documents in three simple steps without uploading files to the cloud."
              centered
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {tool.howItWorks.map((step, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg mb-4 shadow-xs">
                      {index + 1}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {index === 0 ? 'Select Files' : index === 1 ? 'Configure & Process' : 'Instant Download'}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Features Grid */}
        <section className="py-12 sm:py-16">
          <Container>
            <SectionHeading
              title="Key Features & Capabilities"
              subtitle={`Why professionals trust our client-side ${tool.name} tool.`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl">
              {tool.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ Section with FAQPage Schema */}
        <section className="py-12 sm:py-16 bg-white border-y border-slate-200/80">
          <Container>
            <SectionHeading
              title="Frequently Asked Questions"
              subtitle={`Everything you need to know about our free ${tool.name} tool.`}
              centered
            />
            <div className="max-w-3xl mx-auto">
              <FAQAccordion items={tool.faqs} />
            </div>
          </Container>
        </section>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <section className="py-12 sm:py-16">
            <Container>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    Related PDF Tools
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Explore companion tools to streamline your PDF workflow.
                  </p>
                </div>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  <span>All 26 tools</span>
                  <ArrowRight className="h-4 w-4" />
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
