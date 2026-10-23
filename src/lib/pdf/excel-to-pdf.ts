import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { ProgressCallback } from './merge';

/**
 * High-Fidelity Excel (.xlsx, .xls) to PDF Conversion Engine
 * - Automatically computes proportional column widths based on cell text lengths
 * - Renders professional bordered tables with dark header fills and white bold text
 * - Alternating row fills for improved readability
 * - Properly handles multi-page document flow with repeated headers
 */
export async function excelToPdf(
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(15, 'Reading Microsoft Excel workbook structure...');
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('The uploaded Excel workbook contains no visible sheets.');
  }

  onProgress?.(40, `Parsing sheet "${firstSheetName}" grid data...`);
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData: Array<Array<string | number>> = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
  });

  if (jsonData.length === 0) {
    throw new Error('The selected Excel sheet contains no tabular data.');
  }

  onProgress?.(65, 'Calculating auto-fit column widths and layout metrics...');

  // 1. Calculate number of columns and max text width per column
  let maxCols = 0;
  jsonData.forEach((row) => {
    if (row.length > maxCols) maxCols = row.length;
  });

  if (maxCols === 0) maxCols = 1;

  // Auto-orientation: landscape if > 5 columns, portrait otherwise
  const isLandscape = maxCols > 5;
  const doc = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;

  // Calculate proportional column weights
  const colCharLengths: number[] = new Array(maxCols).fill(6);
  jsonData.forEach((row) => {
    for (let c = 0; c < maxCols; c++) {
      const len = String(row[c] ?? '').trim().length;
      if (len > colCharLengths[c]) {
        colCharLengths[c] = Math.min(40, len);
      }
    }
  });

  const totalWeight = colCharLengths.reduce((sum, val) => sum + val, 0);
  const colWidths = colCharLengths.map((w) => (w / totalWeight) * usableWidth);

  let cursorY = margin;
  const rowHeight = 22;

  // Title Banner
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 8, 102); // Deep Navy (#000866)
  const titleText = `${file.name.replace(/\.[^/.]+$/, '')} — Sheet: ${firstSheetName}`;
  doc.text(titleText, margin, cursorY);
  cursorY += 24;

  const renderTableHeader = () => {
    doc.setFillColor(0, 8, 102); // Deep Navy
    doc.rect(margin, cursorY - 14, usableWidth, rowHeight, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);

    let curX = margin;
    const headerRow = jsonData[0] || [];
    for (let c = 0; c < maxCols; c++) {
      const w = colWidths[c];
      const cellText = String(headerRow[c] ?? `COL ${c + 1}`).trim();
      doc.setDrawColor(30, 58, 138);
      doc.rect(curX, cursorY - 14, w, rowHeight, 'S');

      const maxChars = Math.floor(w / 5.5);
      const display = cellText.length > maxChars ? cellText.slice(0, maxChars - 2) + '..' : cellText;
      doc.text(display, curX + 6, cursorY);
      curX += w;
    }
    cursorY += rowHeight;
  };

  onProgress?.(80, 'Rendering styled vector spreadsheet cells into PDF...');
  renderTableHeader();

  // Render Data Rows (starting from row index 1)
  for (let r = 1; r < jsonData.length; r++) {
    if (cursorY + rowHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
      renderTableHeader(); // Repeat header on new page
    }

    const row = jsonData[r];
    const isZebra = r % 2 === 1;

    // Background fill
    if (isZebra) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, cursorY - 14, usableWidth, rowHeight, 'F');
    }

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);

    let curX = margin;
    for (let c = 0; c < maxCols; c++) {
      const w = colWidths[c];
      const rawVal = row[c] !== undefined && row[c] !== null ? String(row[c]).trim() : '';

      // Cell border
      doc.setDrawColor(226, 232, 240);
      doc.rect(curX, cursorY - 14, w, rowHeight, 'S');

      if (rawVal) {
        // Detect numeric/currency formatting for right-alignment
        const isNumeric = /^[$\u20AC\u00A3]?\s*-?\d[\d,.]*\s*([%\/-]|Rs\.?)?$/.test(rawVal);
        const maxChars = Math.floor(w / 5.2);
        const display = rawVal.length > maxChars ? rawVal.slice(0, maxChars - 2) + '..' : rawVal;

        if (isNumeric) {
          doc.text(display, curX + w - 6, cursorY, { align: 'right' });
        } else {
          doc.text(display, curX + 6, cursorY);
        }
      }
      curX += w;
    }
    cursorY += rowHeight;
  }

  onProgress?.(95, 'Finalizing PDF stream...');
  const pdfBlob = doc.output('blob');
  onProgress?.(100, 'Excel to PDF conversion completed with full table styling.');
  return pdfBlob;
}
