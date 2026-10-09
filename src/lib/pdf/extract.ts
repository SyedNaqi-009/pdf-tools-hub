import { PDFDocument } from 'pdf-lib';
import { ProgressCallback } from './merge';

/**
 * Extract specified pages (1-indexed array) into a new PDF document.
 */
export async function extractPdfPages(
  file: File,
  pagesToExtract: number[],
  onProgress?: ProgressCallback
): Promise<Blob> {
  if (pagesToExtract.length === 0) {
    throw new Error('Please specify at least one page number to extract.');
  }

  onProgress?.(15, 'Loading PDF document...');
  const fileBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = sourcePdf.getPageCount();

  // Validate and convert 1-based to 0-based indices
  const validZeroIndices = pagesToExtract
    .filter((p) => p >= 1 && p <= totalPages)
    .map((p) => p - 1);

  if (validZeroIndices.length === 0) {
    throw new Error(`Specified pages are out of bounds (document has ${totalPages} pages).`);
  }

  onProgress?.(50, `Extracting ${validZeroIndices.length} selected pages...`);
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(sourcePdf, validZeroIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  onProgress?.(85, 'Compiling extracted pages...');
  const pdfBytes = await newPdf.save();

  onProgress?.(100, 'Page extraction completed.');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}
