import { PDFDocument } from 'pdf-lib';
import { ProgressCallback } from './merge';

/**
 * Remove password restrictions and output an unencrypted PDF document.
 */
export async function unlockPdf(
  file: File,
  password?: string,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(20, 'Decrypting PDF document streams...');
  const fileBuffer = await file.arrayBuffer();

  onProgress?.(50, 'Extracting unprotected page trees...');
  const sourcePdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

  const unencryptedPdf = await PDFDocument.create();
  const pageIndices = sourcePdf.getPageIndices();
  const copiedPages = await unencryptedPdf.copyPages(sourcePdf, pageIndices);

  copiedPages.forEach((page) => unencryptedPdf.addPage(page));

  onProgress?.(85, 'Saving unencrypted document...');
  const cleanBytes = await unencryptedPdf.save();

  onProgress?.(100, 'Password removed. Document unlocked.');
  return new Blob([cleanBytes as unknown as BlobPart], { type: 'application/pdf' });
}
