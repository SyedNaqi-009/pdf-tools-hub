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

    // Robust embedding with dual fallback and Canvas bridge for WebP/GIF/BMP/SVG
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let embeddedImage: any;
    try {
      embeddedImage = isPng
        ? await pdfDoc.embedPng(imageBytes)
        : await pdfDoc.embedJpg(imageBytes);
    } catch {
      try {
        // Try opposite format if file extension was mismatched
        embeddedImage = isPng
          ? await pdfDoc.embedJpg(imageBytes)
          : await pdfDoc.embedPng(imageBytes);
      } catch {
        // Browser canvas bridge for WebP, GIF, SVG, BMP
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          const imgUrl = URL.createObjectURL(file);
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Unable to decode image: ${file.name}`));
            img.src = imgUrl;
          });

          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const pngDataUrl = canvas.toDataURL('image/png');
            const pngBase64 = pngDataUrl.split(',')[1];
            const pngBytes = Uint8Array.from(atob(pngBase64), (c) => c.charCodeAt(0));
            embeddedImage = await pdfDoc.embedPng(pngBytes);
          }
          canvas.width = 0;
          canvas.height = 0;
          URL.revokeObjectURL(imgUrl);
        } else {
          throw new Error(`Unsupported image format for: ${file.name}`);
        }
      }
    }

    if (!embeddedImage) {
      throw new Error(`Failed to embed image: ${file.name}`);
    }

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
