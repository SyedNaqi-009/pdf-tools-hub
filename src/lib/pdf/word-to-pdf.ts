import { jsPDF } from 'jspdf';
import { ProgressCallback } from './merge';

/**
 * Convert a Microsoft Word (.docx) file into a PDF document.
 */
export async function wordToPdf(
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(15, 'Loading Word processing engine...');
  const mammoth = await import('mammoth');

  onProgress?.(40, 'Extracting text and styles from .docx file...');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const rawText = result.value;

  if (!rawText.trim()) {
    throw new Error('No readable text content found in this Word document.');
  }

  onProgress?.(70, 'Rendering text layout to PDF format...');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const margin = 50;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxLineWidth = pageWidth - margin * 2;
  const lineHeight = 18;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(rawText, maxLineWidth);
  let cursorY = margin;

  for (let i = 0; i < lines.length; i++) {
    if (cursorY + lineHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
    doc.text(lines[i], margin, cursorY);
    cursorY += lineHeight;
  }

  onProgress?.(95, 'Generating PDF file...');
  const pdfBlob = doc.output('blob');

  onProgress?.(100, 'Word to PDF conversion completed.');
  return pdfBlob;
}
