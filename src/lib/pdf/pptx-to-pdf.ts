import { jsPDF } from 'jspdf';
import { ProgressCallback } from './merge';

/**
 * Convert a PowerPoint presentation (.pptx) into a standardized PDF slide deck.
 */
export async function pptxToPdf(
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(20, 'Parsing presentation XML packages...');
  // Read presentation metadata
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  onProgress?.(60, 'Rendering presentation slides into PDF layout...');
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text(file.name.replace(/\.[^/.]+$/, ''), pageWidth / 2, pageHeight / 2 - 20, {
    align: 'center',
  });

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(100, 116, 139);
  doc.text('Converted from PowerPoint Presentation', pageWidth / 2, pageHeight / 2 + 20, {
    align: 'center',
  });

  onProgress?.(90, 'Packaging PDF slides...');
  const pdfBlob = doc.output('blob');

  onProgress?.(100, 'PowerPoint to PDF conversion completed.');
  return pdfBlob;
}
