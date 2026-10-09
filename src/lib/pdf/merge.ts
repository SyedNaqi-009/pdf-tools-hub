import { PDFDocument } from 'pdf-lib';

export type ProgressCallback = (percent: number, message: string) => void;

/**
 * Merge multiple PDF files into a single unified PDF document.
 */
export async function mergePdf(
  files: File[],
  onProgress?: ProgressCallback
): Promise<Blob> {
  if (files.length < 2) {
    throw new Error('Please select at least 2 PDF files to merge.');
  }

  onProgress?.(10, 'Initializing merge engine...');
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const percent = Math.round(15 + ((i + 1) / files.length) * 70);
    onProgress?.(percent, `Merging file ${i + 1} of ${files.length}: ${file.name}...`);

    const fileBuffer = await file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());

    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  onProgress?.(90, 'Finalizing merged document streams...');
  const mergedPdfBytes = await mergedPdf.save();

  onProgress?.(100, 'Merge completed successfully.');
  return new Blob([mergedPdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}
