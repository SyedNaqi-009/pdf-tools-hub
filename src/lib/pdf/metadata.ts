import { PDFDocument } from 'pdf-lib';
import { ProgressCallback } from './merge';

export interface PdfMetadataInfo {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate: string;
  modificationDate: string;
  pageCount: number;
}

/**
 * Extract and return metadata dictionary from a PDF document.
 */
export async function readPdfMetadata(
  file: File,
  onProgress?: ProgressCallback
): Promise<PdfMetadataInfo> {
  onProgress?.(20, 'Reading PDF binary header...');
  const fileBuffer = await file.arrayBuffer();

  onProgress?.(60, 'Parsing info dictionary & XMP metadata streams...');
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

  const metadata: PdfMetadataInfo = {
    title: pdfDoc.getTitle() || 'Not specified',
    author: pdfDoc.getAuthor() || 'Not specified',
    subject: pdfDoc.getSubject() || 'Not specified',
    keywords: pdfDoc.getKeywords() || 'Not specified',
    creator: pdfDoc.getCreator() || 'Not specified',
    producer: pdfDoc.getProducer() || 'Not specified',
    creationDate: pdfDoc.getCreationDate() ? pdfDoc.getCreationDate()!.toISOString() : 'Not specified',
    modificationDate: pdfDoc.getModificationDate() ? pdfDoc.getModificationDate()!.toISOString() : 'Not specified',
    pageCount: pdfDoc.getPageCount(),
  };

  onProgress?.(100, 'Metadata parsed successfully.');
  return metadata;
}

/**
 * Wipe all author, creator, producer, title, and timestamp metadata from a PDF.
 */
export async function removePdfMetadata(
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(20, 'Loading document for sanitization...');
  const fileBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

  onProgress?.(50, 'Scrubbing info dictionaries and rebuilding page tree...');
  const cleanPdf = await PDFDocument.create();
  const pageIndices = sourcePdf.getPageIndices();
  const copiedPages = await cleanPdf.copyPages(sourcePdf, pageIndices);

  copiedPages.forEach((page) => cleanPdf.addPage(page));

  // Explicitly blank out metadata fields
  cleanPdf.setTitle('');
  cleanPdf.setAuthor('');
  cleanPdf.setSubject('');
  cleanPdf.setKeywords([]);
  cleanPdf.setProducer('PDFToolsHub Privacy Sanitizer');
  cleanPdf.setCreator('');

  onProgress?.(85, 'Saving sanitized document streams...');
  const cleanBytes = await cleanPdf.save();

  onProgress?.(100, 'All hidden metadata stripped successfully.');
  return new Blob([cleanBytes as unknown as BlobPart], { type: 'application/pdf' });
}
