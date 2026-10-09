import { PDFDocument, degrees } from 'pdf-lib';
import { ProgressCallback } from './merge';

/**
 * Rotate PDF pages by 90, 180, or 270 degrees.
 */
export async function rotatePdf(
  file: File,
  rotationAngle: 90 | 180 | 270,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(15, 'Loading PDF document...');
  const fileBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  onProgress?.(45, `Applying ${rotationAngle}° rotation across ${pages.length} pages...`);
  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotationAngle) % 360));
  });

  onProgress?.(85, 'Saving re-oriented PDF document...');
  const pdfBytes = await pdfDoc.save();

  onProgress?.(100, 'Rotation completed successfully.');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}
