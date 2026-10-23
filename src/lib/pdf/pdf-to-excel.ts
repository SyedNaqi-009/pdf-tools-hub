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

    // Helper for number/currency parsing
    const parseNumber = (valStr: string): string | number => {
      const cleanNumberStr = valStr
        .replace(/[$,€£%]/g, '')
        .replace(/\/-$/, '')
        .replace(/,/g, '')
        .trim();

      if (
        cleanNumberStr !== '' &&
        !isNaN(Number(cleanNumberStr)) &&
        (!valStr.startsWith('0') || valStr === '0')
      ) {
        return Number(cleanNumberStr);
      }
      return valStr;
    };

    // Check for a distinct table header line (line with >= 3 items and wide horizontal spread)
    let tableHeaderY: number | null = null;
    let tableHeaderItems: RawPdfItem[] | null = null;
    for (const y of sortedYs) {
      const items = lineMap.get(y)!.sort((a, b) => a.x - b.x);
      if (items.length >= 3 && items[items.length - 1].x - items[0].x > 200) {
        tableHeaderY = y;
        tableHeaderItems = items;
        break;
      }
    }

    if (tableHeaderItems && tableHeaderY !== null) {
      // Table-driven grid layout
      const numCols = tableHeaderItems.length;
      const cutoffs: number[] = [];
      for (let c = 0; c < numCols - 1; c++) {
        cutoffs.push((tableHeaderItems[c].x + tableHeaderItems[c + 1].x) / 2);
      }

      const getCol = (x: number): number => {
        for (let c = 0; c < cutoffs.length; c++) {
          if (x < cutoffs[c]) return c;
        }
        return numCols - 1;
      };

      for (const y of sortedYs) {
        const itemsInLine = lineMap.get(y)!.sort((a, b) => a.x - b.x);

        if (y > tableHeaderY) {
          // Metadata or Title lines above table
          const fullStr = itemsInLine
            .map((i) => i.str)
            .join(' ')
            .replace(/ :\s*/g, ': ');

          const colonIdx = fullStr.indexOf(':');
          if (colonIdx !== -1 && colonIdx < 30) {
            allRows.push([
              fullStr.substring(0, colonIdx + 1).trim(),
              fullStr.substring(colonIdx + 1).trim(),
            ]);
          } else if (itemsInLine.length >= 2 && itemsInLine[1].x - itemsInLine[0].x > 150) {
            allRows.push([itemsInLine[0].str, itemsInLine.slice(1).map((i) => i.str).join(' ')]);
          } else {
            allRows.push([fullStr]);
          }
        } else {
          // Table rows (Header + Body rows)
          const row: Array<string | number> = new Array(numCols).fill('');
          for (const item of itemsInLine) {
            const c = getCol(item.x);
            const val = parseNumber(item.str);
            row[c] = row[c] === '' ? val : `${row[c]} ${val}`;
          }
          // Filter trailing empty cells
          while (row.length > 0 && row[row.length - 1] === '') {
            row.pop();
          }
          if (row.length > 0) {
            allRows.push(row);
          }
        }
      }
    } else {
      // General clustering fallback for non-tabular pages
      const allXs: number[] = [];
      for (const y of sortedYs) {
        const itemsInLine = lineMap.get(y)!;
        itemsInLine.forEach((i) => allXs.push(i.x));
      }
      allXs.sort((a, b) => a - b);

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
          let bestColIdx = 0;
          let minDiff = Infinity;
          for (let c = 0; c < columnClusters.length; c++) {
            const diff = Math.abs(columnClusters[c] - item.x);
            if (diff < minDiff) {
              minDiff = diff;
              bestColIdx = c;
            }
          }

          const parsedVal = parseNumber(item.str);
          if (rowValues[bestColIdx] === '') {
            rowValues[bestColIdx] = parsedVal;
          } else {
            rowValues[bestColIdx] = `${rowValues[bestColIdx]} ${parsedVal}`;
          }
        }

        while (rowValues.length > 0 && rowValues[rowValues.length - 1] === '') {
          rowValues.pop();
        }

        if (rowValues.length > 0) {
          allRows.push(rowValues);
        }
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
