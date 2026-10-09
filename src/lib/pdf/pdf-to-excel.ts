import * as XLSX from 'xlsx';
import { ProgressCallback } from './merge';

/**
 * Extract text and tabular data from a PDF into an editable Excel (.xlsx) spreadsheet.
 */
export async function pdfToExcel(
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(10, 'Loading PDF parser...');
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const fileBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const rows: string[][] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const percent = Math.round(15 + ((pageNum / numPages) * 65));
    onProgress?.(percent, `Extracting tabular rows from page ${pageNum} of ${numPages}...`);

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Group items by vertical Y coordinate
    const lineMap: Map<number, Array<{ x: number; text: string }>> = new Map();

    for (const item of textContent.items) {
      if ('str' in item && typeof item.str === 'string' && item.str.trim()) {
        const itemX = 'transform' in item ? item.transform[4] : 0;
        const itemY = 'transform' in item ? Math.round(item.transform[5]) : 0;

        // Group into lines within 4pt tolerance
        let foundY: number | null = null;
        for (const existingY of lineMap.keys()) {
          if (Math.abs(existingY - itemY) <= 4) {
            foundY = existingY;
            break;
          }
        }

        const targetY = foundY !== null ? foundY : itemY;
        if (!lineMap.has(targetY)) {
          lineMap.set(targetY, []);
        }
        lineMap.get(targetY)!.push({ x: itemX, text: item.str.trim() });
      }
    }

    // Sort lines from top of page to bottom
    const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);

    for (const y of sortedYs) {
      const itemsInLine = lineMap.get(y)!;
      // Sort items horizontally
      itemsInLine.sort((a, b) => a.x - b.x);
      rows.push(itemsInLine.map((i) => i.text));
    }
  }

  onProgress?.(85, 'Creating Microsoft Excel (.xlsx) workbook...');
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows.length > 0 ? rows : [['No data extracted']]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Extracted Data');

  const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  onProgress?.(100, 'Excel spreadsheet ready.');

  return new Blob([xlsxBuffer as unknown as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
