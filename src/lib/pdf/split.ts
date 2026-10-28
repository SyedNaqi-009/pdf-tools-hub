import { PDFDocument } from 'pdf-lib';
import { ProgressCallback } from './merge';

export interface SplitOptions {
  mode?: 'all' | 'range' | 'fixed';
  pageRange?: string;
  fixedPageCount?: number;
}

/**
 * Split a multi-page PDF into an array of PDF Blobs.
 * Supports:
 * - 'all': Each page is its own separate PDF
 * - 'range': Specific page groups or ranges (e.g. 1-3, 5, 8-10)
 * - 'fixed': Fixed interval splitting (e.g. every N pages)
 */
export async function splitPdf(
  file: File,
  onProgress?: ProgressCallback,
  options?: SplitOptions
): Promise<Blob[]> {
  onProgress?.(10, 'Loading PDF document...');
  const fileBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = sourcePdf.getPageCount();

  if (totalPages === 0) {
    throw new Error('This PDF contains no pages.');
  }

  const mode = options?.mode || 'all';
  const results: Blob[] = [];

  if (mode === 'all') {
    for (let i = 0; i < totalPages; i++) {
      const percent = Math.round(15 + ((i + 1) / totalPages) * 80);
      onProgress?.(percent, `Extracting page ${i + 1} of ${totalPages}...`);

      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
      newPdf.addPage(copiedPage);

      const pdfBytes = await newPdf.save();
      results.push(new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' }));
    }
  } else if (mode === 'fixed') {
    const chunkSize = Math.max(1, options?.fixedPageCount || 1);
    const numChunks = Math.ceil(totalPages / chunkSize);

    for (let c = 0; c < numChunks; c++) {
      const start = c * chunkSize;
      const end = Math.min(start + chunkSize, totalPages);
      const percent = Math.round(15 + ((c + 1) / numChunks) * 80);
      onProgress?.(percent, `Creating chunk ${c + 1} of ${numChunks} (pages ${start + 1}-${end})...`);

      const newPdf = await PDFDocument.create();
      const indices = [];
      for (let p = start; p < end; p++) indices.push(p);
      const copiedPages = await newPdf.copyPages(sourcePdf, indices);
      copiedPages.forEach((p) => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();
      results.push(new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' }));
    }
  } else if (mode === 'range') {
    // Custom range mode (e.g. "1-3, 5, 8-10")
    const rangeStr = options?.pageRange?.trim() || '1';
    const parts = rangeStr.split(',').map((s) => s.trim()).filter(Boolean);

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const indices: number[] = [];
      if (part.includes('-')) {
        const [s, e] = part.split('-').map((n) => parseInt(n.trim(), 10));
        if (!isNaN(s) && !isNaN(e) && s <= e) {
          for (let p = Math.max(1, s); p <= Math.min(totalPages, e); p++) {
            indices.push(p - 1);
          }
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num) && num >= 1 && num <= totalPages) {
          indices.push(num - 1);
        }
      }

      if (indices.length > 0) {
        onProgress?.(
          Math.round(20 + ((i + 1) / parts.length) * 75),
          `Extracting range ${part}...`
        );
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(sourcePdf, indices);
        copiedPages.forEach((p) => newPdf.addPage(p));
        const pdfBytes = await newPdf.save();
        results.push(new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' }));
      }
    }

    if (results.length === 0) {
      // Fallback: entire doc if range was invalid
      const newPdf = await PDFDocument.create();
      const allIndices = Array.from({ length: totalPages }, (_, i) => i);
      const copied = await newPdf.copyPages(sourcePdf, allIndices);
      copied.forEach((p) => newPdf.addPage(p));
      const pdfBytes = await newPdf.save();
      results.push(new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' }));
    }
  }

  onProgress?.(100, `Successfully split into ${results.length} document(s).`);
  return results;
}
