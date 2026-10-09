import { PDFDocument } from 'pdf-lib';
import { ProgressCallback } from './merge';

/**
 * Embed a signature image (data URL or blob) onto a PDF page.
 */
export async function signPdf(
  file: File,
  signatureDataUrl: string,
  pageIndex: number = 0,
  onProgress?: ProgressCallback
): Promise<Blob> {
  if (!signatureDataUrl) {
    throw new Error('Please provide or draw your signature first.');
  }

  onProgress?.(20, 'Loading PDF document...');
  const fileBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  const targetPageIndex = Math.max(0, Math.min(pages.length - 1, pageIndex));
  const targetPage = pages[targetPageIndex];

  onProgress?.(50, 'Embedding drawn signature...');
  const base64Data = signatureDataUrl.split(',')[1];
  const signatureBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
  const signatureImage = await pdfDoc.embedPng(signatureBytes);

  // Position at bottom right of page
  const { width } = targetPage.getSize();
  const sigWidth = 160;
  const sigHeight = (signatureImage.height / signatureImage.width) * sigWidth;
  const x = width - sigWidth - 50;
  const y = 50;

  targetPage.drawImage(signatureImage, {
    x,
    y,
    width: sigWidth,
    height: sigHeight,
  });

  onProgress?.(85, 'Finalizing signed document...');
  const pdfBytes = await pdfDoc.save();

  onProgress?.(100, 'Signature applied successfully.');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}
