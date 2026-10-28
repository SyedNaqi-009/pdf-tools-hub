'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RotateCw,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  FileArchive,
  FileSpreadsheet,
  Layers,
  Image as ImageIcon,
  FileText,
  AlertTriangle,
  ArrowRightCircle,
  RefreshCw,
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

const TOOL_PRESENTATIONS: Record<
  string,
  { title: string; subtitle: string; buttonLabel: string; dropNoun: string }
> = {
  'merge-pdf': {
    title: 'Merge PDF files',
    subtitle: 'Combine PDFs in the order you want with the easiest PDF merger available.',
    buttonLabel: 'Select PDF files',
    dropNoun: 'PDFs',
  },
  'split-pdf': {
    title: 'Split PDF file',
    subtitle: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'compress-pdf': {
    title: 'Compress PDF file',
    subtitle: 'Reduce file size while optimizing for maximal PDF quality.',
    buttonLabel: 'Select PDF files',
    dropNoun: 'PDFs',
  },
  'pdf-to-word': {
    title: 'PDF to WORD Converter',
    subtitle: 'Convert your PDF to WORD documents with incredible accuracy.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'pdf-to-powerpoint': {
    title: 'PDF to POWERPOINT',
    subtitle: 'Turn your PDF into editable PowerPoint PPT and PPTX presentations.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'pdf-to-excel': {
    title: 'PDF to EXCEL Converter',
    subtitle: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'word-to-pdf': {
    title: 'WORD to PDF Converter',
    subtitle: 'Make DOC and DOCX files easy to read by converting them to PDF.',
    buttonLabel: 'Select WORD files',
    dropNoun: 'WORD files',
  },
  'powerpoint-to-pdf': {
    title: 'POWERPOINT to PDF',
    subtitle: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.',
    buttonLabel: 'Select POWERPOINT files',
    dropNoun: 'PowerPoint presentations',
  },
  'excel-to-pdf': {
    title: 'EXCEL to PDF Converter',
    subtitle: 'Make EXCEL spreadsheets easy to read by converting them to PDF.',
    buttonLabel: 'Select EXCEL files',
    dropNoun: 'Excel files',
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG',
    subtitle: 'Extract all images contained in a PDF or convert each page to a JPG image.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF',
    subtitle: 'Convert your images to PDF. Adjust orientation and margins.',
    buttonLabel: 'Select JPG images',
    dropNoun: 'images',
  },
  'pdf-to-png': {
    title: 'PDF to PNG',
    subtitle: 'Extract pages from your PDF to high-quality transparent PNG images.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'png-to-pdf': {
    title: 'PNG to PDF',
    subtitle: 'Convert PNG images to PDF documents in seconds.',
    buttonLabel: 'Select PNG images',
    dropNoun: 'images',
  },
  'rotate-pdf': {
    title: 'Rotate PDF files',
    subtitle: 'Rotate your PDF pages horizontally or vertically to the right or left.',
    buttonLabel: 'Select PDF files',
    dropNoun: 'PDFs',
  },
  'protect-pdf': {
    title: 'Protect PDF file',
    subtitle: 'Encrypt your PDF with a password to prevent unauthorized access.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'unlock-pdf': {
    title: 'Unlock PDF password',
    subtitle: 'Remove PDF password security, giving you the freedom to use your PDFs.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'sign-pdf': {
    title: 'Sign PDF',
    subtitle: 'Sign yourself or request electronic signatures from others.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'pdf-watermark': {
    title: 'Watermark PDF',
    subtitle: 'Stamp an image or text over your PDF in seconds.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'translate-pdf': {
    title: 'Translate PDF',
    subtitle: 'Translate PDF documents accurately into any language in your browser.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'organize-pdf': {
    title: 'Organize PDF',
    subtitle: 'Sort pages of your PDF file however you like. Delete or add pages.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'delete-pdf-pages': {
    title: 'Delete PDF pages',
    subtitle: 'Remove pages from a PDF document online.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'extract-pdf-pages': {
    title: 'Extract PDF pages',
    subtitle: 'Get a new document with only the pages you need.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'pdf-metadata-viewer': {
    title: 'PDF Metadata Viewer',
    subtitle: 'Inspect hidden document metadata and properties instantly.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'pdf-metadata-remover': {
    title: 'PDF Metadata Remover',
    subtitle: 'Remove sensitive author, date and software tags from your PDF.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'pdf-thumbnail-generator': {
    title: 'PDF Thumbnail Generator',
    subtitle: 'Generate high-resolution cover and page preview images.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'pdf-preview': {
    title: 'PDF Preview',
    subtitle: 'View and read PDF documents directly in your browser.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
  'fill-pdf-forms': {
    title: 'Fill PDF Forms',
    subtitle: 'Fill out interactive PDF forms directly in your browser.',
    buttonLabel: 'Select PDF file',
    dropNoun: 'PDF',
  },
};

export default function ToolPageLayout({ tool }: ToolPageLayoutProps) {
  const relatedTools = getRelatedTools(tool);
  const schemas = getToolStructuredData(tool);
  const presentation = TOOL_PRESENTATIONS[tool.slug] || {
    title: tool.name.toLowerCase().includes('pdf') ? `${tool.name} files` : tool.name,
    subtitle: tool.shortDescription,
    buttonLabel: tool.allowMultiple ? `Select ${tool.name} files` : `Select ${tool.name} file`,
    dropNoun: 'files',
  };

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
  const [rotationAngle, setRotationAngle] = useState<0 | 90 | 180 | 270>(90);
  const [pageRange, setPageRange] = useState('1');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [password, setPassword] = useState('');
  const [pageOrder, setPageOrder] = useState('1, 2');
  const [targetLang, setTargetLang] = useState('es');
  const [metadataInfo, setMetadataInfo] = useState<Record<string, string | number> | null>(null);

  // Advanced Options
  const [sheetMode, setSheetMode] = useState<'single' | 'multiple'>('single');
  const [downloadAsZip, setDownloadAsZip] = useState(true);
  const [imageOrientation, setImageOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [imagePageSize, setImagePageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [imageMargin, setImageMargin] = useState<'none' | 'small' | 'large'>('small');
  const [splitMode, setSplitMode] = useState<'all' | 'range' | 'fixed'>('all');
  const [splitFixedCount, setSplitFixedCount] = useState(2);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Hidden File Input Ref for adding more files
  const addFilesInputRef = useRef<HTMLInputElement | null>(null);

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
    setDeleteConfirm(false);
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

  // Handle adding more files from red + button
  const handleAppendFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      if (tool.allowMultiple) {
        setFiles((prev) => [...prev, ...newFiles]);
      } else {
        setFiles(newFiles);
      }
      setResultBlob(null);
      setResultBlobs([]);
      setError(null);
    }
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
    const isImage =
      firstFile.type.startsWith('image/') ||
      /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(firstFile.name);

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
          const blob = await rotatePdf(files[0], rotationAngle === 0 ? 90 : rotationAngle, updateProgress);
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

  const getActionLabel = () => {
    switch (tool.slug) {
      case 'jpg-to-pdf':
      case 'png-to-pdf':
        return 'Convert to PDF';
      case 'pdf-to-excel':
        return 'Convert to Excel';
      case 'pdf-to-word':
        return 'Convert to Word';
      case 'word-to-pdf':
        return 'Convert to PDF';
      case 'excel-to-pdf':
        return 'Convert to PDF';
      case 'powerpoint-to-pdf':
        return 'Convert to PDF';
      case 'pdf-to-powerpoint':
        return 'Convert to PPTX';
      case 'pdf-to-jpg':
        return 'Convert to JPG';
      case 'pdf-to-png':
        return 'Convert to PNG';
      case 'compress-pdf':
        return 'Compress PDF';
      case 'rotate-pdf':
        return 'Rotate PDF';
      case 'split-pdf':
        return 'Split PDF';
      case 'merge-pdf':
        return 'Merge PDF';
      case 'delete-pdf-pages':
        return deleteConfirm ? 'Confirm & Delete' : 'Delete Pages';
      case 'extract-pdf-pages':
        return 'Extract Pages';
      default:
        return `Execute ${tool.name}`;
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
        {/* Clean Light Focused Tool Header (iLovePDF Style) */}
        <div className="pt-12 sm:pt-16 pb-2 text-center">
          <Container>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#33333b]">
              {presentation.title}
            </h1>
            <p className="mt-3 text-base sm:text-lg lg:text-xl text-[#47474f] max-w-2xl mx-auto leading-relaxed">
              {presentation.subtitle}
            </p>
          </Container>
        </div>

        {/* Interactive Workspace Workstation */}
        <Container className="py-4 sm:py-6">
          {files.length === 0 ? (
            /* Upload Screen: Clean Centered iLovePDF Drop Zone */
            <div className="mx-auto max-w-3xl">
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
                buttonLabel={presentation.buttonLabel}
                dropNoun={presentation.dropNoun}
              />
            </div>
          ) : (
            /* Active Studio: iLovePDF Style Studio (Center/Left Light Preview Canvas, Right Side Options Panel) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT / CENTER: Clean Light Document Preview Stage (lg:col-span-8) */}
              <div className="lg:col-span-8 bg-[#f4f5f7] border border-zinc-200/90 rounded-3xl p-6 sm:p-10 relative min-h-[460px] sm:min-h-[520px] flex flex-col items-center justify-center shadow-xs overflow-hidden">
                
                {/* Hidden File Input for Add Button */}
                <input
                  ref={addFilesInputRef}
                  type="file"
                  multiple={tool.allowMultiple}
                  accept={Array.isArray(tool.acceptedFileTypes) ? tool.acceptedFileTypes.join(',') : tool.acceptedFileTypes}
                  onChange={handleAppendFiles}
                  className="hidden"
                />

                {/* Floating Add More Files (+) Button with Count Badge */}
                <button
                  type="button"
                  onClick={() => addFilesInputRef.current?.click()}
                  title="Add more files"
                  className="absolute top-5 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#e5322d] text-white shadow-xl hover:bg-[#d42722] hover:scale-105 transition-all cursor-pointer group"
                >
                  <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform" />
                  <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-black text-white border-2 border-white shadow">
                    {files.length}
                  </span>
                </button>

                {/* Reset / Replace Link */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="absolute top-5 left-5 z-20 text-xs font-mono font-bold text-zinc-500 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All</span>
                </button>

                {/* The Paper Sheet Card (Realistic Floating White Sheet Preview) */}
                <div
                  className={`bg-white rounded-lg shadow-xl border border-zinc-200/80 transition-all duration-300 relative flex items-center justify-center overflow-hidden ${
                    // Dynamic Aspect Ratio based on orientation for image tools
                    tool.slug === 'jpg-to-pdf' || tool.slug === 'png-to-pdf'
                      ? imageOrientation === 'landscape'
                        ? 'w-[320px] sm:w-[380px] aspect-[1.414/1]'
                        : 'w-[230px] sm:w-[260px] aspect-[1/1.414]'
                      : 'w-[240px] sm:w-[270px] aspect-[1/1.414]'
                  } ${
                    // Dynamic padding based on selected margins
                    tool.slug === 'jpg-to-pdf' || tool.slug === 'png-to-pdf'
                      ? imageMargin === 'none'
                        ? 'p-0'
                        : imageMargin === 'large'
                        ? 'p-6 sm:p-7'
                        : 'p-3 sm:p-4'
                      : 'p-2'
                  }`}
                  style={{
                    // Live CSS Rotation for Rotate PDF Tool
                    transform:
                      tool.slug === 'rotate-pdf'
                        ? `rotate(${rotationAngle}deg)`
                        : undefined,
                    transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s ease, height 0.3s ease, padding 0.25s ease',
                  }}
                >
                  {previewImageSrc ? (
                    <img
                      src={previewImageSrc}
                      alt="Uploaded preview"
                      className={`max-h-full max-w-full object-contain ${
                        imageMargin === 'none' ? 'w-full h-full object-cover' : 'rounded shadow-2xs'
                      }`}
                    />
                  ) : (
                    <canvas
                      ref={previewCanvasRef}
                      className="max-h-full max-w-full object-contain shadow-xs rounded"
                    />
                  )}
                </div>

                {/* Filename & Document Details Below Sheet */}
                <div className="mt-4 text-center">
                  <p className="text-xs font-semibold text-zinc-700 truncate max-w-[280px]">
                    {files[0].name}
                  </p>
                  <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                    {(files[0].size / 1024 / 1024).toFixed(2)} MB · {files.length} file(s)
                  </p>
                </div>

                {/* PDF Multi-Page Navigation Controls */}
                {previewTotalPages > 1 && (
                  <div className="mt-3 flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-zinc-200/80 shadow-xs">
                    <button
                      type="button"
                      onClick={() => changePreviewPage(previewPage - 1)}
                      disabled={previewPage <= 1}
                      className="p-1 rounded-full text-zinc-700 disabled:opacity-30 hover:bg-zinc-100 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-mono font-bold text-zinc-700 px-1">
                      {previewPage} of {previewTotalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => changePreviewPage(previewPage + 1)}
                      disabled={previewPage >= previewTotalPages}
                      className="p-1 rounded-full text-zinc-700 disabled:opacity-30 hover:bg-zinc-100 cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT SIDEBAR: Parameters, Options & Action CTA (lg:col-span-4) */}
              <div className="lg:col-span-4 w-full bg-white border border-zinc-200 rounded-3xl shadow-sm p-6 sm:p-7 space-y-6 lg:sticky lg:top-6">
                
                {/* Options Panel Title */}
                <div className="border-b border-zinc-100 pb-3">
                  <h2 className="text-xl font-black text-zinc-900 text-center tracking-tight">
                    {tool.name} options
                  </h2>
                </div>

                {/* Option 1: JPG/PNG to PDF - Page orientation */}
                {(tool.slug === 'jpg-to-pdf' || tool.slug === 'png-to-pdf') && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-800 block">
                      Page orientation
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Portrait Card */}
                      <button
                        type="button"
                        onClick={() => setImageOrientation('portrait')}
                        className={`rounded-xl border p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          imageOrientation === 'portrait'
                            ? 'border-zinc-800 bg-zinc-50 shadow-xs ring-1 ring-zinc-800 text-zinc-900 font-bold'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <div className="w-5 h-7 border-2 border-current rounded-[3px] mb-2 flex items-center justify-center">
                          <div className="w-2.5 h-3.5 border border-dashed border-current/40" />
                        </div>
                        <span className="text-xs">Portrait</span>
                      </button>

                      {/* Landscape Card */}
                      <button
                        type="button"
                        onClick={() => setImageOrientation('landscape')}
                        className={`rounded-xl border p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          imageOrientation === 'landscape'
                            ? 'border-zinc-800 bg-zinc-50 shadow-xs ring-1 ring-zinc-800 text-zinc-900 font-bold'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <div className="w-7 h-5 border-2 border-current rounded-[3px] mb-2 flex items-center justify-center">
                          <div className="w-3.5 h-2.5 border border-dashed border-current/40" />
                        </div>
                        <span className="text-xs">Landscape</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Option 2: JPG/PNG to PDF - Page size */}
                {(tool.slug === 'jpg-to-pdf' || tool.slug === 'png-to-pdf') && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-zinc-800 block">
                      Page size
                    </label>
                    <select
                      value={imagePageSize}
                      onChange={(e) => setImagePageSize(e.target.value as any)}
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-zinc-900 focus:border-zinc-900 focus:outline-hidden"
                    >
                      <option value="a4">A4 (297x210 mm)</option>
                      <option value="letter">US Letter (215x279 mm)</option>
                      <option value="fit">Fit (same page size as image)</option>
                    </select>
                  </div>
                )}

                {/* Option 3: JPG/PNG to PDF - Margin */}
                {(tool.slug === 'jpg-to-pdf' || tool.slug === 'png-to-pdf') && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-800 block">
                      Margin
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {/* No Margin */}
                      <button
                        type="button"
                        onClick={() => setImageMargin('none')}
                        className={`rounded-xl border p-3 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          imageMargin === 'none'
                            ? 'border-zinc-800 bg-zinc-50 shadow-xs ring-1 ring-zinc-800 text-zinc-900 font-bold'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <div className="w-7 h-7 border-2 border-current rounded-[3px] mb-1.5 bg-current/10 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px]">No margin</span>
                      </button>

                      {/* Small Margin */}
                      <button
                        type="button"
                        onClick={() => setImageMargin('small')}
                        className={`rounded-xl border p-3 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          imageMargin === 'small'
                            ? 'border-zinc-800 bg-zinc-50 shadow-xs ring-1 ring-zinc-800 text-zinc-900 font-bold'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <div className="w-7 h-7 border border-dashed border-current/60 rounded-[3px] p-0.5 mb-1.5 flex items-center justify-center">
                          <div className="w-5 h-5 border border-current bg-current/10 rounded-[2px] flex items-center justify-center">
                            <ImageIcon className="w-3 h-3" />
                          </div>
                        </div>
                        <span className="text-[11px]">Small</span>
                      </button>

                      {/* Big Margin */}
                      <button
                        type="button"
                        onClick={() => setImageMargin('large')}
                        className={`rounded-xl border p-3 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          imageMargin === 'large'
                            ? 'border-zinc-800 bg-zinc-50 shadow-xs ring-1 ring-zinc-800 text-zinc-900 font-bold'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <div className="w-7 h-7 border border-dashed border-current/60 rounded-[3px] p-1.5 mb-1.5 flex items-center justify-center">
                          <div className="w-3.5 h-3.5 border border-current bg-current/10 rounded-[2px] flex items-center justify-center">
                            <ImageIcon className="w-2.5 h-2.5" />
                          </div>
                        </div>
                        <span className="text-[11px]">Big</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Rotate PDF Options */}
                {tool.slug === 'rotate-pdf' && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-800 block">
                      Rotation direction
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setRotationAngle(90)}
                        className={`p-3 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          rotationAngle === 90
                            ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                            : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <RotateCw className="h-5 w-5" />
                        <span>90° Right</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRotationAngle(270)}
                        className={`p-3 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          rotationAngle === 270
                            ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                            : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <RotateCcw className="h-5 w-5" />
                        <span>90° Left</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRotationAngle(180)}
                        className={`p-3 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          rotationAngle === 180
                            ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                            : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <RotateCw className="h-5 w-5 transform rotate-90" />
                        <span>180° Flip</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* PDF to Excel - Worksheet Arrangement */}
                {tool.slug === 'pdf-to-excel' && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-800 block">
                      Worksheet arrangement
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        type="button"
                        onClick={() => setSheetMode('single')}
                        className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                          sheetMode === 'single'
                            ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                        }`}
                      >
                        <span className="text-xs font-bold text-zinc-900 block">Single Sheet (Consolidated)</span>
                        <span className="text-[11px] text-zinc-500">All PDF pages merged into one master sheet</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSheetMode('multiple')}
                        className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                          sheetMode === 'multiple'
                            ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                        }`}
                      >
                        <span className="text-xs font-bold text-zinc-900 block">Multiple Sheets</span>
                        <span className="text-[11px] text-zinc-500">One dedicated worksheet per PDF page</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* PDF to JPG / PNG - ZIP Checkbox */}
                {(tool.slug === 'pdf-to-jpg' || tool.slug === 'pdf-to-png') && (
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5 space-y-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-900">
                      <input
                        type="checkbox"
                        checked={downloadAsZip}
                        onChange={(e) => setDownloadAsZip(e.target.checked)}
                        className="h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-500"
                      />
                      <span>Download pages as ZIP archive</span>
                    </label>
                    <p className="text-[11px] text-zinc-500 pl-6">
                      Extracts all high-resolution page images into a single package.
                    </p>
                  </div>
                )}

                {/* Split PDF Mode Options */}
                {tool.slug === 'split-pdf' && (
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-800 block">
                      Split mode
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        type="button"
                        onClick={() => setSplitMode('all')}
                        className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                          splitMode === 'all'
                            ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
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
                            ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                        }`}
                      >
                        <span className="text-xs font-bold text-zinc-900 block">Custom Page Ranges</span>
                        <span className="text-[11px] text-zinc-500">e.g. 1-3, 5, 8-10</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSplitMode('fixed')}
                        className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                          splitMode === 'fixed'
                            ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                        }`}
                      >
                        <span className="text-xs font-bold text-zinc-900 block">Fixed Chunks</span>
                        <span className="text-[11px] text-zinc-500">Split into chunks of N pages</span>
                      </button>
                    </div>

                    {splitMode === 'range' && (
                      <div className="pt-1">
                        <input
                          type="text"
                          value={pageRange}
                          onChange={(e) => setPageRange(e.target.value)}
                          className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-mono text-zinc-900"
                          placeholder="e.g. 1-2, 3-5"
                        />
                      </div>
                    )}

                    {splitMode === 'fixed' && (
                      <div className="pt-1">
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

                {/* Quality Preset Selector */}
                {['compress-pdf', 'pdf-to-word', 'word-to-pdf', 'pdf-to-excel', 'excel-to-pdf', 'pdf-to-jpg', 'pdf-to-png', 'pdf-to-powerpoint', 'powerpoint-to-pdf'].includes(tool.slug) && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-800 block">
                      Compression & Quality
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['low', 'medium', 'high'] as ConversionQuality[]).map((q) => {
                        const preset = QUALITY_PRESETS[q];
                        const isSelected = quality === q;
                        return (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setQuality(q)}
                            className={`rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'border-zinc-800 bg-zinc-50 ring-1 ring-zinc-800 text-zinc-900 font-bold'
                                : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                            }`}
                          >
                            <span className="text-xs block capitalize">{q}</span>
                            <span className="text-[10px] text-zinc-400 block truncate">{preset.badge}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Page Range Inputs (Extract, Delete, Thumbnails) */}
                {(tool.slug === 'extract-pdf-pages' ||
                  tool.slug === 'delete-pdf-pages' ||
                  tool.slug === 'pdf-thumbnail-generator') && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-800 block">
                      {tool.slug === 'delete-pdf-pages'
                        ? 'Pages to delete (e.g. 1, 3, 5-7):'
                        : tool.slug === 'pdf-thumbnail-generator'
                        ? 'Target page number:'
                        : 'Pages to extract (e.g. 1, 3, 5-8):'}
                    </label>
                    <input
                      type="text"
                      value={pageRange}
                      onChange={(e) => {
                        setPageRange(e.target.value);
                        setDeleteConfirm(false);
                      }}
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-mono text-zinc-900"
                      placeholder="e.g. 1, 3, 5-8"
                    />

                    {deleteConfirm && tool.slug === 'delete-pdf-pages' && (
                      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Confirm Deletion</p>
                          <p className="mt-0.5 text-[11px] text-amber-800">
                            Click "Confirm & Delete" below to proceed.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Watermark Stamp */}
                {tool.slug === 'pdf-watermark' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-zinc-800 block">
                      Watermark Stamp Text
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-mono text-zinc-900"
                      placeholder="e.g. CONFIDENTIAL or DRAFT"
                    />
                  </div>
                )}

                {/* Password Protection */}
                {(tool.slug === 'protect-pdf' || tool.slug === 'unlock-pdf') && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-zinc-800 block">
                      {tool.slug === 'protect-pdf' ? 'Set Password:' : 'Current Password:'}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-mono text-zinc-900"
                      placeholder="Enter password..."
                    />
                  </div>
                )}

                {/* Signature Pad */}
                {tool.slug === 'sign-pdf' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-zinc-800">
                        Signature pad
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
                        width={300}
                        height={100}
                        className="w-full h-24 bg-zinc-50 rounded-lg cursor-crosshair touch-none"
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
                      />
                    </div>
                  </div>
                )}

                {/* Translation Language */}
                {tool.slug === 'translate-pdf' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-zinc-800 block">
                      Target Language
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

                {/* Main Action Button (Vibrant iLovePDF Style Crimson/Red Button) */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleExecute}
                    disabled={isProcessing}
                    className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-[#e5322d] px-6 py-4 text-base font-black text-white shadow-xl shadow-red-600/25 hover:bg-[#d42722] hover:shadow-2xl transition-all cursor-pointer active:scale-98 tracking-wide disabled:opacity-50"
                  >
                    <span>{getActionLabel()}</span>
                    <ArrowRightCircle className="h-5 w-5 fill-white/20" />
                  </button>
                </div>

                {/* Processing Progress Status */}
                <ProcessingStatus
                  isProcessing={isProcessing}
                  progress={progress}
                  statusText={statusText}
                  error={error}
                  onCancel={handleCancel}
                />

                {/* Result Download Card */}
                {resultBlob && (
                  <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-5 shadow-sm space-y-3 pt-4">
                    <div className="flex items-center gap-2 text-emerald-900 text-xs font-bold uppercase font-mono">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Ready for Download</span>
                    </div>

                    <DownloadButton
                      onDownload={handleDownload}
                      onReset={handleReset}
                      fileName={resultFilename}
                      fileSizeBytes={resultBlob.size}
                      originalSizeBytes={files[0]?.size}
                      label={
                        resultFilename.endsWith('.zip')
                          ? 'Download ZIP'
                          : `Download ${tool.outputExtension.toUpperCase()}`
                      }
                    />
                  </div>
                )}

                {/* Metadata Inspection View */}
                {metadataInfo && (
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2 max-h-48 overflow-y-auto">
                    <h4 className="text-[11px] font-bold text-zinc-900 uppercase font-mono border-b pb-1">
                      Metadata Report
                    </h4>
                    <div className="divide-y divide-zinc-200 text-[11px]">
                      {Object.entries(metadataInfo).map(([k, v]) => (
                        <div key={k} className="py-1 flex justify-between gap-2">
                          <span className="font-medium text-zinc-500 capitalize">{k}</span>
                          <span className="text-zinc-900 font-mono truncate">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Privacy Guarantee Note */}
          <div className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-zinc-500 font-mono">
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
