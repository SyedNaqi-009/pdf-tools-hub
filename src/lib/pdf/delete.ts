import { PDFDocument } from 'pdf-lib';
import { ProgressCallback } from './merge';

/**
 * Remove specified pages (1-indexed array) from a PDF and return the remaining pages.
 */
export async function deletePdfPages(
  file: File,
  pagesToDelete: number[],
  onProgress?: ProgressCallback
): Promise<Blob> {
  if (pagesToDelete.length === 0) {
    throw new Error('Please specify at least one page number to remove.');
  }

  onProgress?.(15, 'Loading PDF document...');
  const fileBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = sourcePdf.getPageCount();

  const toDeleteSet = new Set(pagesToDelete);
  const remainingIndices: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (!toDeleteSet.has(i)) {
      remainingIndices.push(i - 1);
    }
  }

  if (remainingIndices.length === 0) {
    throw new Error('Cannot delete all pages from the document. At least one page must remain.');
  }

  onProgress?.(50, `Preserving ${remainingIndices.length} remaining pages...`);
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(sourcePdf, remainingIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  onProgress?.(85, 'Building new PDF file...');
  const pdfBytes = await newPdf.save();

  onProgress?.(100, 'Page deletion completed.');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}
