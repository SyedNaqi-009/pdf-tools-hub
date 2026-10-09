import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { ProgressCallback } from './merge';

/**
 * Convert an Excel spreadsheet (.xlsx, .xls) into a formatted PDF document.
 */
export async function excelToPdf(
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(15, 'Reading Excel workbook...');
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('Workbook contains no sheets.');
  }

  onProgress?.(45, `Parsing sheet "${firstSheetName}"...`);
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData: Array<Array<string | number>> = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
  });

  if (jsonData.length === 0) {
    throw new Error('The selected sheet is empty.');
  }

  onProgress?.(70, 'Building printable PDF table layout...');
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let cursorY = margin;
  const rowHeight = 20;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`Spreadsheet Report: ${file.name.replace(/\.[^/.]+$/, '')}`, margin, cursorY);
  cursorY += 25;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);

  // Render rows
  for (let r = 0; r < jsonData.length; r++) {
    if (cursorY + rowHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }

    const row = jsonData[r];
    const rowStr = row.map((cell) => String(cell).trim()).filter(Boolean).join('  |  ');

    if (rowStr) {
      doc.text(rowStr, margin, cursorY);
      cursorY += rowHeight;
    }
  }

  onProgress?.(95, 'Generating PDF file...');
  const pdfBlob = doc.output('blob');

  onProgress?.(100, 'Excel to PDF conversion completed.');
  return pdfBlob;
}
