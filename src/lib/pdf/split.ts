import { PDFDocument } from 'pdf-lib';
import { ProgressCallback } from './merge';

/**
 * Split a multi-page PDF into an array of single-page PDF Blobs.
 */
export async function splitPdf(
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob[]> {
  onProgress?.(10, 'Loading PDF document...');
  const fileBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const pageCount = sourcePdf.getPageCount();

  if (pageCount === 0) {
    throw new Error('This PDF contains no pages.');
  }

  const results: Blob[] = [];

  for (let i = 0; i < pageCount; i++) {
    const percent = Math.round(15 + ((i + 1) / pageCount) * 80);
    onProgress?.(percent, `Extracting page ${i + 1} of ${pageCount}...`);

    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
    newPdf.addPage(copiedPage);

    const pdfBytes = await newPdf.save();
    results.push(new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' }));
  }

  onProgress?.(100, `Successfully split into ${pageCount} individual pages.`);
  return results;
}
