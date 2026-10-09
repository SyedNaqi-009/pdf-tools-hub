import { PDFDocument, PageSizes } from 'pdf-lib';
import { ProgressCallback } from './merge';

/**
 * Convert single or multiple JPG/PNG images into a standardized A4 PDF document.
 */
export async function imagesToPdf(
  files: File[],
  onProgress?: ProgressCallback
): Promise<Blob> {
  if (files.length === 0) {
    throw new Error('Please select at least one image file.');
  }

  onProgress?.(10, 'Initializing PDF document...');
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const percent = Math.round(15 + ((i + 1) / files.length) * 75);
    onProgress?.(percent, `Embedding image ${i + 1} of ${files.length}: ${file.name}...`);

    const imageBytes = await file.arrayBuffer();
    const isPng = file.type.includes('png') || file.name.toLowerCase().endsWith('.png');

    const embeddedImage = isPng
      ? await pdfDoc.embedPng(imageBytes)
      : await pdfDoc.embedJpg(imageBytes);

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    // Use A4 dimensions: 595.28 x 841.89 points
    const [a4Width, a4Height] = PageSizes.A4;
    const isLandscape = imgWidth > imgHeight;

    const pageWidth = isLandscape ? a4Height : a4Width;
    const pageHeight = isLandscape ? a4Width : a4Height;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Calculate scaled dimensions with margins
    const margin = 36; // 0.5 inch margin
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;

    const x = (pageWidth - scaledWidth) / 2;
    const y = (pageHeight - scaledHeight) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    });
  }

  onProgress?.(92, 'Finalizing PDF output...');
  const pdfBytes = await pdfDoc.save();

  onProgress?.(100, 'Image-to-PDF compilation complete.');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}
