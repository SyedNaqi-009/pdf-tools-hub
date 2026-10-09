import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { ProgressCallback } from './merge';

export interface WatermarkOptions {
  text: string;
  opacity?: number;
  fontSize?: number;
  color?: { r: number; g: number; b: number };
}

/**
 * Add a custom semi-transparent text watermark across all pages.
 */
export async function addWatermark(
  file: File,
  options: WatermarkOptions,
  onProgress?: ProgressCallback
): Promise<Blob> {
  const text = options.text.trim();
  if (!text) {
    throw new Error('Please enter watermark text.');
  }

  onProgress?.(15, 'Loading PDF document...');
  const fileBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();
  const opacity = options.opacity ?? 0.35;
  const fontSize = options.fontSize ?? 48;
  const color = options.color ?? { r: 0.5, g: 0.5, b: 0.5 };

  onProgress?.(40, `Stamping watermark on ${pages.length} pages...`);

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    // Center positioning
    const x = (width - textWidth) / 2;
    const y = (height - textHeight) / 2;

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(45),
    });
  });

  onProgress?.(85, 'Finalizing watermarked PDF...');
  const pdfBytes = await pdfDoc.save();

  onProgress?.(100, 'Watermark applied successfully.');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}
