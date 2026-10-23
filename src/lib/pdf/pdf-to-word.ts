import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  ImageRun,
  AlignmentType,
  HeadingLevel,
  PageBreak,
} from 'docx';
import { ProgressCallback } from './merge';
import { ConversionQuality } from '../conversion-registry';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RichTextItem {
  str: string;
  x: number;
  y: number;
  fontSize: number;
  fontName: string;
  isBold: boolean;
  isItalic: boolean;
  color: string; // hex "RRGGBB"
}

interface PageRect {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string; // hex fill
}

interface PageImage {
  x: number;
  y: number;
  width: number;
  height: number;
  data: Uint8Array;
  mimeType: 'image/png' | 'image/jpeg';
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function rgbToHex(r: number, g: number, b: number): string {
  const h = (c: number) =>
    Math.max(0, Math.min(255, Math.round(c)))
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
  return h(r) + h(g) + h(b);
}

function colorContrast(hex: string): boolean {
  // Return true if color is "dark" → we want white text on it
  const r = parseInt(hex.slice(0, 2), 16) || 0;
  const g = parseInt(hex.slice(2, 4), 16) || 0;
  const b = parseInt(hex.slice(4, 6), 16) || 0;
  return (r * 299 + g * 587 + b * 114) / 1000 < 135;
}

/* ------------------------------------------------------------------ */
/*  Core: Extract rich content from a single PDF page                  */
/* ------------------------------------------------------------------ */

async function extractPageContent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdfDoc: any,
  pageNum: number
): Promise<{
  textItems: RichTextItem[];
  rects: PageRect[];
  images: PageImage[];
  pageWidth: number;
  pageHeight: number;
}> {
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1 });
  const pageWidth = viewport.width;
  const pageHeight = viewport.height;
  const textContent = await page.getTextContent();
  const ops = await page.getOperatorList();

  const pdfjsLib = await import('pdfjs-dist');
  const OPS = pdfjsLib.OPS;

  const colorAtTextIndex: string[] = [];
  const rects: PageRect[] = [];
  const images: PageImage[] = [];

  let fillColor = '000000';
  const stateStack: { fillColor: string; ctm: number[] }[] = [];
  let ctm = [1, 0, 0, 1, 0, 0];

  const multiplyMatrix = (a: number[], b: number[]): number[] => [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5],
  ];

  let pendingPath: { minX: number; minY: number; maxX: number; maxY: number } | null = null;

  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i];
    const args = ops.argsArray[i];

    switch (fn) {
      case OPS.save:
        stateStack.push({ fillColor, ctm: [...ctm] });
        break;

      case OPS.restore:
        if (stateStack.length > 0) {
          const prev = stateStack.pop()!;
          fillColor = prev.fillColor;
          ctm = prev.ctm;
        }
        break;

      case OPS.setFillRGBColor:
        fillColor = rgbToHex(args[0], args[1], args[2]);
        break;

      case OPS.setFillGray: {
        const g = Math.round(args[0] * 255);
        fillColor = rgbToHex(g, g, g);
        break;
      }

      case OPS.setFillCMYKColor: {
        const [c, m, yy, k] = args;
        const r2 = 255 * (1 - c) * (1 - k);
        const g2 = 255 * (1 - m) * (1 - k);
        const b2 = 255 * (1 - yy) * (1 - k);
        fillColor = rgbToHex(r2, g2, b2);
        break;
      }

      case OPS.transform:
        ctm = multiplyMatrix(ctm, args as number[]);
        break;

      case OPS.constructPath:
        if (args && args[2]) {
          const [minX, minY, maxX, maxY] = args[2];
          pendingPath = { minX, minY, maxX, maxY };
        }
        break;

      case OPS.fill:
      case OPS.eoFill:
      case OPS.fillStroke:
      case OPS.eoFillStroke:
        if (pendingPath) {
          const { minX, minY, maxX, maxY } = pendingPath;
          const w = maxX - minX;
          const h = maxY - minY;
          const x = ctm[4] + minX * ctm[0];
          const y = ctm[5] + minY * ctm[3];
          // Filter out full-page white/background covers
          if (!(w > pageWidth - 10 && h > pageHeight - 10 && fillColor === 'FFFFFF')) {
            if (w > 2 && h > 2) {
              rects.push({ x, y, width: w, height: h, color: fillColor });
            }
          }
          pendingPath = null;
        }
        break;

      case OPS.showText:
      case OPS.showSpacedText:
        colorAtTextIndex.push(fillColor);
        break;

      case OPS.paintImageXObject: {
        try {
          const imgId = args[0];
          const imgData = await (page as unknown as { objs: { get: (id: string) => unknown } }).objs.get(imgId);
          if (imgData && typeof imgData === 'object' && 'data' in imgData) {
            const obj = imgData as { data: Uint8Array; width: number; height: number };
            if (typeof document !== 'undefined') {
              const canvas = document.createElement('canvas');
              canvas.width = obj.width;
              canvas.height = obj.height;
              const ctx2d = canvas.getContext('2d');
              if (ctx2d) {
                const imgDataObj = ctx2d.createImageData(obj.width, obj.height);
                const srcLen = obj.data.length;
                const pixelCount = obj.width * obj.height;
                if (srcLen >= pixelCount * 4) {
                  imgDataObj.data.set(obj.data.slice(0, pixelCount * 4));
                } else if (srcLen >= pixelCount * 3) {
                  for (let p = 0; p < pixelCount; p++) {
                    imgDataObj.data[p * 4] = obj.data[p * 3];
                    imgDataObj.data[p * 4 + 1] = obj.data[p * 3 + 1];
                    imgDataObj.data[p * 4 + 2] = obj.data[p * 3 + 2];
                    imgDataObj.data[p * 4 + 3] = 255;
                  }
                }
                ctx2d.putImageData(imgDataObj, 0, 0);
                const dataUrl = canvas.toDataURL('image/png');
                const base64 = dataUrl.split(',')[1];
                const binary = atob(base64);
                const bytes = new Uint8Array(binary.length);
                for (let b = 0; b < binary.length; b++) bytes[b] = binary.charCodeAt(b);

                const scaleX = Math.abs(ctm[0]);
                const scaleY = Math.abs(ctm[3]);
                images.push({
                  x: ctm[4],
                  y: ctm[5],
                  width: scaleX > 0 ? scaleX : obj.width,
                  height: scaleY > 0 ? scaleY : obj.height,
                  data: bytes,
                  mimeType: 'image/png',
                });
              }
            }
          }
        } catch {
          // Best effort image extraction
        }
        break;
      }

      default:
        break;
    }
  }

  const textItems: RichTextItem[] = [];
  let showTextIdx = 0;

  for (const rawItem of textContent.items) {
    if (!('str' in rawItem) || typeof rawItem.str !== 'string' || rawItem.str.length === 0) continue;

    const x = 'transform' in rawItem ? rawItem.transform[4] : 0;
    const y = 'transform' in rawItem ? Math.round(rawItem.transform[5]) : 0;
    const fontSize = 'transform' in rawItem ? Math.round(Math.abs(rawItem.transform[0])) : 11;
    const fontName = (
      'fontName' in rawItem && typeof rawItem.fontName === 'string' ? rawItem.fontName : ''
    ).toLowerCase();

    const isBold =
      fontName.includes('bold') ||
      fontName.includes('black') ||
      fontName.includes('heavy') ||
      fontName.includes('700') ||
      fontName.includes('800') ||
      fontName.includes('900');
    const isItalic = fontName.includes('italic') || fontName.includes('oblique');

    let color = '000000';
    if (showTextIdx < colorAtTextIndex.length) {
      color = colorAtTextIndex[showTextIdx];
    }

    if (rawItem.str.trim().length > 0) {
      showTextIdx++;
    }

    textItems.push({ str: rawItem.str, x, y, fontSize, fontName, isBold, isItalic, color });
  }

  return { textItems, rects, images, pageWidth, pageHeight };
}

/* ------------------------------------------------------------------ */
/*  Find background rect that covers a given text coordinate          */
/* ------------------------------------------------------------------ */

function findBackgroundForLine(rects: PageRect[], lineY: number): PageRect | null {
  for (const rect of rects) {
    const rectTop = rect.y + rect.height;
    const rectBottom = rect.y;
    if (lineY >= rectBottom - 4 && lineY <= rectTop + 4 && rect.width > 80) {
      if (rect.color !== 'FFFFFF') {
        return rect;
      }
    }
  }
  return null;
}

function findBoxForPoint(rects: PageRect[], x: number, y: number): PageRect | null {
  for (const rect of rects) {
    if (
      x >= rect.x - 5 &&
      x <= rect.x + rect.width + 5 &&
      y >= rect.y - 5 &&
      y <= rect.y + rect.height + 5
    ) {
      if (rect.color !== 'FFFFFF') {
        return rect;
      }
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  PUBLIC: High-Fidelity PDF → Word Conversion Engine                */
/* ------------------------------------------------------------------ */

export async function pdfToWord(
  file: File,
  quality: ConversionQuality = 'medium',
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(8, 'Initializing high-fidelity PDF parser with color & graphics extraction...');
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const fileBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const docChildren: (Paragraph | Table)[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const percent = Math.round(12 + (pageNum / numPages) * 70);
    onProgress?.(percent, `Extracting layout, colors, tables, and typography (page ${pageNum}/${numPages})...`);

    if (pageNum > 1 && docChildren.length > 0) {
      docChildren.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }

    const { textItems, rects, images, pageWidth } = await extractPageContent(pdfDoc, pageNum);

    if (textItems.length === 0 && images.length === 0) continue;

    // 1. Embed Images / Logos at top
    for (const img of images) {
      try {
        const maxW = 500;
        const scale = img.width > maxW ? maxW / img.width : 1;
        docChildren.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: img.data,
                transformation: {
                  width: Math.round(img.width * scale),
                  height: Math.round(img.height * scale),
                },
                type: 'png',
              }),
            ],
            spacing: { after: 120 },
          })
        );
      } catch {
        // Skip invalid image
      }
    }

    // 2. Identify side-by-side header callout boxes (like E-Solar Energies banner on top right)
    // Find rectangles that cover only part of the width (e.g. width < pageWidth * 0.7) in upper region
    const calloutBoxes = rects.filter(
      (r) => r.width > 80 && r.width < pageWidth * 0.7 && r.y > 600 && colorContrast(r.color)
    );

    const handledTextIndices = new Set<number>();

    for (const box of calloutBoxes) {
      // Find text items inside this callout box
      const insideBoxIndices: number[] = [];
      const leftCompanionIndices: number[] = [];

      for (let idx = 0; idx < textItems.length; idx++) {
        const item = textItems[idx];
        if (!item.str.trim()) continue;

        if (
          item.x >= box.x - 10 &&
          item.x <= box.x + box.width + 10 &&
          item.y >= box.y - 10 &&
          item.y <= box.y + box.height + 10
        ) {
          insideBoxIndices.push(idx);
        } else if (
          item.x < box.x - 20 &&
          item.y >= box.y - 30 &&
          item.y <= box.y + box.height + 30
        ) {
          leftCompanionIndices.push(idx);
        }
      }

      if (insideBoxIndices.length > 0) {
        insideBoxIndices.forEach((i) => handledTextIndices.add(i));
        leftCompanionIndices.forEach((i) => handledTextIndices.add(i));

        // Reconstruct as a 2-column header table
        const leftItems = leftCompanionIndices.map((i) => textItems[i]);
        const rightItems = insideBoxIndices.map((i) => textItems[i]);

        // Left cell content
        const leftParagraphs = leftItems.map(
          (item) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: item.str,
                  bold: item.isBold || item.fontSize >= 16,
                  size: Math.max(24, item.fontSize * 2),
                  color: item.color === 'FFFFFF' ? '000866' : item.color,
                }),
              ],
              spacing: { after: 60 },
            })
        );

        // Right cell content (White bold text inside dark background box)
        const rightParagraphs = rightItems.map(
          (item) =>
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: item.str,
                  bold: true,
                  size: Math.max(22, item.fontSize * 2),
                  color: 'FFFFFF', // White text on dark box
                }),
              ],
              spacing: { after: 60 },
            })
        );

        docChildren.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: leftParagraphs.length > 0 ? leftParagraphs : [new Paragraph({ text: '' })],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: box.color, color: 'auto' },
                    children: rightParagraphs,
                  }),
                ],
              }),
            ],
          })
        );
        docChildren.push(new Paragraph({ text: '', spacing: { after: 140 } }));
      }
    }

    // 3. Process remaining text items grouped into horizontal lines
    const remainingItems = textItems.filter((_, idx) => !handledTextIndices.has(idx) && _.str.trim().length > 0);

    const lineMap: Map<number, RichTextItem[]> = new Map();
    for (const item of remainingItems) {
      let matchedY: number | null = null;
      for (const existingY of lineMap.keys()) {
        if (Math.abs(existingY - item.y) <= 4) {
          matchedY = existingY;
          break;
        }
      }
      const targetY = matchedY !== null ? matchedY : item.y;
      if (!lineMap.has(targetY)) lineMap.set(targetY, []);
      lineMap.get(targetY)!.push(item);
    }

    const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);

    let currentTableRows: { items: RichTextItem[]; bgRect: PageRect | null }[] = [];

    const flushTable = () => {
      if (currentTableRows.length === 0) return;

      if (currentTableRows.length === 1 && currentTableRows[0].items.length <= 1) {
        const single = currentTableRows[0].items[0];
        if (single) {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: single.str,
                  bold: single.isBold,
                  italics: single.isItalic,
                  size: Math.max(18, single.fontSize * 2),
                  color: single.color,
                }),
              ],
              spacing: { after: 120 },
            })
          );
        }
        currentTableRows = [];
        return;
      }

      const maxCols = Math.max(...currentTableRows.map((r) => r.items.length));

      const tableRows = currentTableRows.map((rowData) => {
        const { items: rowItems, bgRect } = rowData;
        const isHeaderRow = bgRect && colorContrast(bgRect.color);

        const cells: TableCell[] = [];
        for (let c = 0; c < maxCols; c++) {
          const item = rowItems[c];
          let textColor = item ? item.color : '000000';
          if (isHeaderRow) {
            textColor = 'FFFFFF'; // White text on dark navy header
          }

          cells.push(
            new TableCell({
              width: { size: Math.round(100 / maxCols), type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: item ? item.str : '',
                      bold: item ? item.isBold || !!isHeaderRow : false,
                      italics: item ? item.isItalic : false,
                      size: item ? Math.max(18, item.fontSize * 2) : 20,
                      color: textColor,
                    }),
                  ],
                }),
              ],
              shading: bgRect
                ? { type: ShadingType.CLEAR, fill: bgRect.color, color: 'auto' }
                : undefined,
            })
          );
        }
        return new TableRow({ children: cells });
      });

      const firstBg = currentTableRows[0]?.bgRect;
      const borderColor = firstBg ? firstBg.color : 'CBD5E1';

      docChildren.push(
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
            left: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
            right: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
          },
        })
      );
      docChildren.push(new Paragraph({ text: '', spacing: { after: 120 } }));
      currentTableRows = [];
    };

    for (const y of sortedYs) {
      const lineItems = lineMap.get(y)!;
      lineItems.sort((a, b) => a.x - b.x);

      const bgRect = findBackgroundForLine(rects, y);

      let isTableRow = false;
      if (lineItems.length >= 2) {
        for (let i = 1; i < lineItems.length; i++) {
          if (lineItems[i].x - (lineItems[i - 1].x + lineItems[i - 1].str.length * 5) > 25) {
            isTableRow = true;
            break;
          }
        }
      }
      if (bgRect && (lineItems.length >= 2 || lineItems.some((i) => i.str.toUpperCase() === i.str))) {
        isTableRow = true;
      }

      if (isTableRow && quality !== 'low') {
        currentTableRows.push({ items: lineItems, bgRect });
        continue;
      } else {
        flushTable();
      }

      // Metadata Key-Value pairs: e.g. "Employee Name: Hamza Alloudin"
      const runs: TextRun[] = [];
      for (let i = 0; i < lineItems.length; i++) {
        const item = lineItems[i];
        runs.push(
          new TextRun({
            text: (i > 0 ? ' ' : '') + item.str,
            bold: item.isBold || item.str.endsWith(':'),
            italics: item.isItalic,
            size: Math.max(18, item.fontSize * 2),
            color: item.color,
          })
        );
      }

      const maxFontInLine = Math.max(...lineItems.map((i) => i.fontSize));
      let heading: (typeof HeadingLevel)[keyof typeof HeadingLevel] | undefined;
      if (maxFontInLine >= 18) {
        heading = HeadingLevel.HEADING_1;
      } else if (maxFontInLine >= 14) {
        heading = HeadingLevel.HEADING_2;
      } else if (maxFontInLine >= 12 && lineItems.some((i) => i.isBold)) {
        heading = HeadingLevel.HEADING_3;
      }

      const hasDarkBg = bgRect && colorContrast(bgRect.color);

      docChildren.push(
        new Paragraph({
          children: runs,
          heading,
          spacing: { after: heading ? 140 : 80, line: 260 },
          shading: hasDarkBg
            ? { type: ShadingType.CLEAR, fill: bgRect!.color, color: 'auto' }
            : undefined,
        })
      );
    }

    flushTable();
  }

  onProgress?.(88, 'Packaging into Microsoft Word OpenXML (.docx) container...');
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children:
          docChildren.length > 0
            ? docChildren
            : [new Paragraph({ children: [new TextRun('No readable document structure detected.')] })],
      },
    ],
  });

  const docxBlob = await Packer.toBlob(doc);
  onProgress?.(100, 'Word document generated with preserved colors, tables & layout.');
  return docxBlob;
}
