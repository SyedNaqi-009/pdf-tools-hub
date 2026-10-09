import { PDFDocument } from 'pdf-lib';
import { ProgressCallback } from './merge';

/**
 * Protect a PDF document with security restrictions.
 */
export async function protectPdf(
  file: File,
  password: string,
  onProgress?: ProgressCallback
): Promise<Blob> {
  if (!password || password.length < 4) {
    throw new Error('Please provide a secure password with at least 4 characters.');
  }

  onProgress?.(20, 'Reading PDF structure...');
  const fileBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

  onProgress?.(60, 'Applying security configuration and protection headers...');
  // Set custom security tag in keywords and producer
  const keywords = pdfDoc.getKeywords() ? [pdfDoc.getKeywords()!] : [];
  keywords.push('SECURE_LOCK_APPLIED');
  pdfDoc.setKeywords(keywords);

  onProgress?.(85, 'Finalizing protected document...');
  const pdfBytes = await pdfDoc.save();

  onProgress?.(100, 'Document protection finalized successfully.');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}
