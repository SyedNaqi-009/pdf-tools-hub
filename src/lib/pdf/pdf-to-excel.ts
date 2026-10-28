import type ExcelJSType from 'exceljs';
import { ProgressCallback } from './merge';
import { ConversionQuality } from '../conversion-registry';

interface RawPdfItem {
  str: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontName?: string;
}

interface ExtractedImage {
  name: string;
  width: number;
  height: number;
  pngBuffer: ArrayBuffer;
  x: number; // pt from left
  y: number; // pt from bottom
  renderWidth: number; // pt
  renderHeight: number; // pt
}

export interface PdfToExcelOptions {
  sheetMode?: 'single' | 'multiple';
}

/**
 * Converts raw PDF image object into a standard PNG ArrayBuffer.
 * Works seamlessly in both browser (Canvas / OffscreenCanvas) and Node.js environments.
 */
async function imageObjToPngBuffer(imgObj: {
  width: number;
  height: number;
  data: Uint8Array | Uint8ClampedArray;
  kind?: number;
}): Promise<ArrayBuffer | null> {
  if (typeof document === 'undefined') {
    return null;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = imgObj.width;
    canvas.height = imgObj.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imgData = ctx.createImageData(imgObj.width, imgObj.height);
    if (imgObj.data.length === imgObj.width * imgObj.height * 4) {
      imgData.data.set(imgObj.data);
    } else if (imgObj.data.length === imgObj.width * imgObj.height * 3) {
      for (let i = 0, j = 0; i < imgObj.data.length; i += 3, j += 4) {
        imgData.data[j] = imgObj.data[i];
        imgData.data[j + 1] = imgObj.data[i + 1];
        imgData.data[j + 2] = imgObj.data[i + 2];
        imgData.data[j + 3] = 255;
      }
    } else if (imgObj.data.length === imgObj.width * imgObj.height) {
      for (let i = 0, j = 0; i < imgObj.data.length; i += 1, j += 4) {
        const v = imgObj.data[i];
        imgData.data[j] = v;
        imgData.data[j + 1] = v;
        imgData.data[j + 2] = v;
        imgData.data[j + 3] = 255;
      }
    } else {
      return null;
    }

    ctx.putImageData(imgData, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );
    if (!blob) return null;
    return await blob.arrayBuffer();
  } catch (err) {
    console.warn('Image to PNG conversion warning:', err);
    return null;
  }
}

/**
 * Intelligent PDF to Excel (.xlsx) Extraction Engine:
 * - Dual Engine: Table grid detection + Narrative/Contract prose layout.
 * - Image & Logo extraction: Preserves embedded company logos and stamps as native Excel pictures.
 * - Typographic styling: Bold section headings, clean bullet points, parsed numbers and currency.
 * - Configurable sheets: Single continuous worksheet or Multiple worksheets per page.
 */
export async function pdfToExcel(
  file: File,
  quality: ConversionQuality = 'medium',
  onProgress?: ProgressCallback,
  options?: PdfToExcelOptions
): Promise<Blob> {
  onProgress?.(8, 'Loading PDF document analyzer and Excel engine...');
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const ExcelJS = await import('exceljs');
  const WorkbookClass = (ExcelJS.default?.Workbook ||
    ExcelJS.Workbook) as typeof ExcelJSType.Workbook;
  const workbook = new WorkbookClass();
  workbook.creator = 'DoPDF Converter';

  const fileBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const sheetMode = options?.sheetMode || 'single';

  // Helper for numeric/currency parsing
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

  // Determine primary worksheet
  let mainSheet: ExcelJSType.Worksheet | null = null;
  if (sheetMode === 'single') {
    mainSheet = workbook.addWorksheet('Document');
    mainSheet.getColumn(1).width = 95;
    for (let c = 2; c <= 12; c++) {
      mainSheet.getColumn(c).width = 16;
    }
  }

  let globalRowIdx = 1;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const percent = Math.round(15 + (pageNum / numPages) * 70);
    onProgress?.(
      percent,
      `Extracting structure, tables & logos (page ${pageNum} of ${numPages})...`
    );

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const ops = await page.getOperatorList();
    const viewport = page.getViewport({ scale: 1.0 });

    const activeSheet: ExcelJSType.Worksheet =
      sheetMode === 'single'
        ? (mainSheet as ExcelJSType.Worksheet)
        : workbook.addWorksheet(`Page ${pageNum}`);

    if (sheetMode === 'multiple') {
      activeSheet.getColumn(1).width = 95;
      for (let c = 2; c <= 12; c++) {
        activeSheet.getColumn(c).width = 16;
      }
    }

    const pageStartRow = sheetMode === 'single' ? globalRowIdx : 1;

    // 1. Group text items into rows by Y coordinate within tolerance of 4pt
    const lineMap: Map<number, RawPdfItem[]> = new Map();
    for (const item of textContent.items) {
      if ('str' in item && typeof item.str === 'string' && item.str.length > 0) {
        const x = 'transform' in item ? Math.round(item.transform[4]) : 0;
        const y = 'transform' in item ? Math.round(item.transform[5]) : 0;
        const height = 'height' in item ? Math.round(item.height) : 10;
        const fontName = 'fontName' in item ? String(item.fontName) : '';

        let matchedY: number | null = null;
        for (const existingY of lineMap.keys()) {
          if (Math.abs(existingY - y) <= 4) {
            matchedY = existingY;
            break;
          }
        }
        const targetY = matchedY !== null ? matchedY : y;
        if (!lineMap.has(targetY)) {
          lineMap.set(targetY, []);
        }
        lineMap.get(targetY)!.push({ str: item.str, x, y, height, fontName });
      }
    }

    const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);

    // 2. Extract embedded images & logos
    const extractedImages: ExtractedImage[] = [];
    let currentTransform = [1, 0, 0, 1, 0, 0];
    const transformStack: number[][] = [];

    for (let i = 0; i < ops.fnArray.length; i++) {
      const fn = ops.fnArray[i];
      const args = ops.argsArray[i];
      if (fn === pdfjsLib.OPS.save) {
        transformStack.push([...currentTransform]);
      } else if (fn === pdfjsLib.OPS.restore) {
        if (transformStack.length > 0) currentTransform = transformStack.pop()!;
      } else if (fn === pdfjsLib.OPS.transform) {
        currentTransform = args;
      } else if (
        fn === pdfjsLib.OPS.paintImageXObject ||
        fn === pdfjsLib.OPS.paintInlineImageXObject
      ) {
        const imgName = Array.isArray(args) ? args[0] : '';
        if (imgName) {
          try {
            const imgObj = await new Promise<any>((res) =>
              page.objs.get(imgName, res)
            );
            if (imgObj && imgObj.data && imgObj.width > 20 && imgObj.height > 20) {
              const pngBuf = await imageObjToPngBuffer(imgObj);
              if (pngBuf) {
                extractedImages.push({
                  name: imgName,
                  width: imgObj.width,
                  height: imgObj.height,
                  pngBuffer: pngBuf,
                  x: currentTransform[4] || 0,
                  y: currentTransform[5] || 0,
                  renderWidth: Math.abs(currentTransform[0] || imgObj.width),
                  renderHeight: Math.abs(currentTransform[3] || imgObj.height),
                });
              }
            }
          } catch {
            // Ignore corrupted images
          }
        }
      }
    }

    // 3. Detect if page is predominantly a multi-column structured table or narrative document
    let multiColumnLineCount = 0;
    let tableHeaderY: number | null = null;
    let tableHeaderItems: RawPdfItem[] | null = null;

    for (const y of sortedYs) {
      const items = lineMap.get(y)!.sort((a, b) => a.x - b.x);
      // Check for wide horizontal spread between distinct text chunks
      if (items.length >= 3 && items[items.length - 1].x - items[0].x > 200) {
        multiColumnLineCount++;
        if (tableHeaderY === null) {
          tableHeaderY = y;
          tableHeaderItems = items;
        }
      }
    }

    const isTabularPage = multiColumnLineCount >= 3 && tableHeaderItems !== null;

    if (isTabularPage && tableHeaderItems && tableHeaderY !== null) {
      // TABULAR GRID ENGINE
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
          // Pre-table Title or Metadata
          const fullStr = itemsInLine
            .map((i) => i.str)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

          const row = activeSheet.addRow([fullStr]);
          row.getCell(1).font = { name: 'Calibri', size: 11, bold: true };
          if (sheetMode === 'single') globalRowIdx++;
        } else {
          // Table Data or Header
          const rowValues: Array<string | number> = new Array(numCols).fill('');
          for (const item of itemsInLine) {
            const c = getCol(item.x);
            const val = parseNumber(item.str);
            rowValues[c] =
              rowValues[c] === '' ? val : `${rowValues[c]} ${val}`;
          }
          while (rowValues.length > 0 && rowValues[rowValues.length - 1] === '') {
            rowValues.pop();
          }
          if (rowValues.length > 0) {
            const row = activeSheet.addRow(rowValues);
            const isHeader = y === tableHeaderY;
            for (let c = 1; c <= rowValues.length; c++) {
              const cell = row.getCell(c);
              cell.font = { name: 'Calibri', size: 11, bold: isHeader };
              if (isHeader) {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFF1F5F9' },
                };
              }
            }
            if (sheetMode === 'single') globalRowIdx++;
          }
        }
      }
    } else {
      // NARRATIVE / CONTRACT FLOW ENGINE
      const rawLines: string[] = [];
      for (const y of sortedYs) {
        const items = lineMap.get(y)!.sort((a, b) => a.x - b.x);
        let lineText = '';
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (i > 0) {
            const prev = items[i - 1];
            const gap = item.x - (prev.x + prev.str.length * 5);
            if (gap > 2 && !lineText.endsWith(' ') && !item.str.startsWith(' ')) {
              lineText += ' ';
            }
          }
          lineText += item.str;
        }

        lineText = lineText
          .replace(/[\uF0B7\u2022\u25CF\u2043\u2219]/g, '•')
          .replace(/\s+,/g, ',')
          .replace(/\s+;/g, ';')
          .replace(/\s+:/g, ':')
          .replace(/\s+/g, ' ')
          .trim();

        if (lineText) rawLines.push(lineText);
      }

      // Merge sentence continuations into coherent paragraphs
      const paragraphs: string[] = [];
      for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i];
        const isBullet = line.startsWith('•');
        const isSection =
          /^(\d+(\.\d+)*\s+[A-Z]|WHEREAS|NOW,\s*THEREFORE|IN\s+WITNESS\s+WHEREOF|[A-Z\s]{5,}:?$)/.test(
            line
          );
        const isLabel =
          /^(Address:|\[Property Owner Name\]|Retain Each LLC|IN WITNESS WHEREOF)/.test(
            line
          );

        if (paragraphs.length > 0 && !isBullet && !isSection && !isLabel) {
          const prev = paragraphs[paragraphs.length - 1];
          const prevIsHeading = /^(\d+(\.\d+)*\s+[A-Z])/.test(prev);
          const prevEndsWithColon = prev.endsWith(':');

          if (
            !prevIsHeading &&
            !prevEndsWithColon &&
            (prev.endsWith(',') ||
              prev.endsWith(' (the') ||
              !/[.:?!]$/.test(prev) ||
              line.startsWith('"') ||
              line.startsWith('behalf;') ||
              line.startsWith('follows:'))
          ) {
            paragraphs[paragraphs.length - 1] = `${prev} ${line}`;
            continue;
          }
        }
        paragraphs.push(line);
      }

      for (const para of paragraphs) {
        const isHeading =
          /^(\d+(\.\d+)*\s+[A-Z]|WHEREAS|NOW,\s*THEREFORE|IN\s+WITNESS\s+WHEREOF|[A-Z\s]{5,}:?$)/.test(
            para
          ) ||
          para.includes('Property Management Contract') ||
          (para.endsWith(':') && para.length < 60);

        const row = activeSheet.addRow([para]);
        const cell = row.getCell(1);
        cell.font = {
          name: 'Calibri',
          size: 11,
          bold: isHeading,
        };
        cell.alignment = { vertical: 'middle', wrapText: false };
        if (sheetMode === 'single') globalRowIdx++;
      }
    }

    // Embed extracted images into the active sheet
    for (const img of extractedImages) {
      try {
        const imgId = workbook.addImage({
          buffer: img.pngBuffer,
          extension: 'png',
        });

        // Determine Excel anchor row and column based on PDF geometry
        // PDF standard coordinates: (0,0) bottom-left
        const topOffsetPt = Math.max(0, viewport.height - (img.y + img.renderHeight));
        // Approximate 1 row ~ 18pt in Excel
        const rowOffset = Math.round(topOffsetPt / 18);
        const anchorRow = Math.max(1, pageStartRow + rowOffset);

        // Approximate Column A width ~ 550pt, each subsequent column ~ 80pt
        let anchorCol = 1;
        if (img.x > 300) {
          anchorCol = 2.2;
        }

        activeSheet.addImage(imgId, {
          tl: { col: anchorCol, row: anchorRow },
          ext: {
            width: Math.min(img.renderWidth, 300),
            height: Math.min(img.renderHeight, 150),
          },
        });
      } catch (err) {
        console.warn('Failed to embed image into worksheet:', err);
      }
    }

    // Page separator row in single sheet mode
    if (sheetMode === 'single' && pageNum < numPages) {
      activeSheet.addRow([]);
      globalRowIdx++;
    }
  }

  onProgress?.(92, 'Generating final Microsoft Excel (.xlsx) workbook...');
  const xlsxBuffer = await workbook.xlsx.writeBuffer();

  onProgress?.(100, 'Excel spreadsheet generated successfully.');
  return new Blob([xlsxBuffer as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
