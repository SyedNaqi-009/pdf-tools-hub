import { PDFDocument } from 'pdf-lib';
import { ProgressCallback } from './merge';

/**
 * Reorder PDF pages according to a user-specified sequence (1-indexed array).
 */
export async function organizePdfPages(
  file: File,
  newOrder: number[],
  onProgress?: ProgressCallback
): Promise<Blob> {
  if (newOrder.length === 0) {
    throw new Error('Please specify a valid page order.');
  }

  onProgress?.(15, 'Loading PDF document...');
  const fileBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = sourcePdf.getPageCount();

  // Validate indices
  const validZeroIndices = newOrder
    .filter((num) => num >= 1 && num <= totalPages)
    .map((num) => num - 1);

  if (validZeroIndices.length === 0) {
    throw new Error(`Invalid page sequence for a document with ${totalPages} pages.`);
  }

  onProgress?.(45, `Reorganizing ${validZeroIndices.length} pages in custom order...`);
  const reorderedPdf = await PDFDocument.create();
  const copiedPages = await reorderedPdf.copyPages(sourcePdf, validZeroIndices);

  copiedPages.forEach((page) => reorderedPdf.addPage(page));

  onProgress?.(85, 'Finalizing reordered PDF document...');
  const pdfBytes = await reorderedPdf.save();

  onProgress?.(100, 'Page reorganization completed successfully.');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}
