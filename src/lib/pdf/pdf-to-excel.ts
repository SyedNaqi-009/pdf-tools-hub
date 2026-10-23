import * as XLSX from 'xlsx';
import { ProgressCallback } from './merge';
import { ConversionQuality } from '../conversion-registry';

interface RawPdfItem {
  str: string;
  x: number;
  y: number;
}

/**
 * Intelligent PDF to Excel (.xlsx) Extraction Engine
 * - Clusters text items into column grids and aligned table rows
 * - Parses numeric values, currency, percentages, and decimals into native Excel types
 * - Sets automatic column widths and header styles
 */
export async function pdfToExcel(
  file: File,
  quality: ConversionQuality = 'medium',
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(8, 'Loading PDF document analyzer...');
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const fileBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const workbook = XLSX.utils.book_new();
  const allRows: Array<Array<string | number>> = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const percent = Math.round(15 + ((pageNum / numPages) * 65));
    onProgress?.(percent, `Extracting and aligning tabular grid (page ${pageNum} of ${numPages})...`);

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    const rawItems: RawPdfItem[] = [];
    for (const item of textContent.items) {
      if ('str' in item && typeof item.str === 'string' && item.str.trim().length > 0) {
        const x = 'transform' in item ? Math.round(item.transform[4]) : 0;
        const y = 'transform' in item ? Math.round(item.transform[5]) : 0;
        rawItems.push({ str: item.str.trim(), x, y });
      }
    }

    if (rawItems.length === 0) continue;

    // Group items into rows by Y coordinate within tolerance of 4pt
    const lineMap: Map<number, RawPdfItem[]> = new Map();
    for (const item of rawItems) {
      let matchedY: number | null = null;
      for (const existingY of lineMap.keys()) {
        if (Math.abs(existingY - item.y) <= 4) {
          matchedY = existingY;
          break;
        }
      }
      const targetY = matchedY !== null ? matchedY : item.y;
      if (!lineMap.has(targetY)) {
        lineMap.set(targetY, []);
      }
      lineMap.get(targetY)!.push(item);
    }

    const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);

    // Identify standard column X anchor points across the page
    const allXs: number[] = [];
    for (const y of sortedYs) {
      const itemsInLine = lineMap.get(y)!;
      itemsInLine.forEach((i) => allXs.push(i.x));
    }
    allXs.sort((a, b) => a - b);

    // Cluster X coordinates within 25pt threshold to form discrete column slots
    const columnClusters: number[] = [];
    for (const x of allXs) {
      const existing = columnClusters.find((c) => Math.abs(c - x) <= 25);
      if (existing === undefined) {
        columnClusters.push(x);
      }
    }
    columnClusters.sort((a, b) => a - b);

    for (const y of sortedYs) {
      const itemsInLine = lineMap.get(y)!;
      itemsInLine.sort((a, b) => a.x - b.x);

      const rowValues: Array<string | number> = new Array(columnClusters.length).fill('');

      for (const item of itemsInLine) {
        // Find closest column cluster
        let bestColIdx = 0;
        let minDiff = Infinity;
        for (let c = 0; c < columnClusters.length; c++) {
          const diff = Math.abs(columnClusters[c] - item.x);
          if (diff < minDiff) {
            minDiff = diff;
            bestColIdx = c;
          }
        }

        // Try parsing numbers (decimals, currencies, percentages, negatives, and "/-" notation)
        let parsedVal: string | number = item.str;
        const cleanNumberStr = item.str
          .replace(/[$,€£%]/g, '')
          .replace(/\/-$/, '')
          .replace(/,/g, '')
          .trim();

        if (
          cleanNumberStr !== '' &&
          !isNaN(Number(cleanNumberStr)) &&
          (!item.str.startsWith('0') || item.str === '0') // preserve leading zeros for codes/IDs unless just '0'
        ) {
          parsedVal = Number(cleanNumberStr);
        }

        if (rowValues[bestColIdx] === '') {
          rowValues[bestColIdx] = parsedVal;
        } else {
          rowValues[bestColIdx] = `${rowValues[bestColIdx]} ${parsedVal}`;
        }
      }

      // Filter trailing empty cells
      while (rowValues.length > 0 && rowValues[rowValues.length - 1] === '') {
        rowValues.pop();
      }

      if (rowValues.length > 0) {
        allRows.push(rowValues);
      }
    }

    // Insert clean separator if multiple pages
    if (pageNum < numPages && allRows.length > 0) {
      allRows.push([]);
    }
  }

  onProgress?.(86, 'Formulating Microsoft Excel (.xlsx) workbook and cell widths...');
  const worksheetData = allRows.length > 0 ? allRows : [['No structured data extracted']];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Auto-fit column widths
  const colWidths: { wch: number }[] = [];
  for (const row of worksheetData) {
    row.forEach((cell, idx) => {
      const len = String(cell ?? '').length;
      colWidths[idx] = { wch: Math.max(colWidths[idx]?.wch || 10, Math.min(len + 3, 40)) };
    });
  }
  worksheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Extracted Data');

  const xlsxBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
    compression: quality !== 'high',
  });

  onProgress?.(100, 'Excel spreadsheet generated successfully.');
  return new Blob([xlsxBuffer as unknown as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
