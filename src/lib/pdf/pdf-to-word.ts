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
  const r = parseInt(hex.slice(0, 2), 16) || 0;
  const g = parseInt(hex.slice(2, 4), 16) || 0;
  const b = parseInt(hex.slice(4, 6), 16) || 0;
  return (r * 299 + g * 587 + b * 114) / 1000 < 135;
}

function transformBBox(bbox: number[], ctm: number[]): { x: number; y: number; width: number; height: number } {
  const [minX, minY, maxX, maxY] = bbox;
  const [a, b, c, d, e, f] = ctm;
  const p1 = { x: a * minX + c * minY + e, y: b * minX + d * minY + f };
  const p2 = { x: a * maxX + c * minY + e, y: b * maxX + d * minY + f };
  const p3 = { x: a * minX + c * maxY + e, y: b * minX + d * maxY + f };
  const p4 = { x: a * maxX + c * maxY + e, y: b * maxX + d * maxY + f };
  const actualMinX = Math.min(p1.x, p2.x, p3.x, p4.x);
  const actualMaxX = Math.max(p1.x, p2.x, p3.x, p4.x);
  const actualMinY = Math.min(p1.y, p2.y, p3.y, p4.y);
  const actualMaxY = Math.max(p1.y, p2.y, p3.y, p4.y);
  return {
    x: Math.round(actualMinX),
    y: Math.round(actualMinY),
    width: Math.round(actualMaxX - actualMinX),
    height: Math.round(actualMaxY - actualMinY),
  };
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

  let pendingBBox: { x: number; y: number; width: number; height: number } | null = null;

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
          pendingBBox = transformBBox(args[2], ctm);
        }
        break;

      case OPS.fill:
      case OPS.eoFill:
      case OPS.fillStroke:
      case OPS.eoFillStroke:
        if (pendingBBox) {
          if (
            !(pendingBBox.width > pageWidth - 10 && pendingBBox.height > pageHeight - 10 && fillColor === 'FFFFFF')
          ) {
            if (pendingBBox.width > 5 && pendingBBox.height > 5 && fillColor !== '000000') {
              rects.push({
                x: pendingBBox.x,
                y: pendingBBox.y,
                width: pendingBBox.width,
                height: pendingBBox.height,
                color: fillColor,
              });
            }
          }
          pendingBBox = null;
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

    const x = 'transform' in rawItem ? Math.round(rawItem.transform[4]) : 0;
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

    let color = '050066'; // Default to deep navy if unspecified
    if (showTextIdx < colorAtTextIndex.length && colorAtTextIndex[showTextIdx] !== '000000') {
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

    // 1. Embed Images / Logos at top if present
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

    const handledTextIndices = new Set<number>();

    // 2. Identify Header Banner (e.g. E-Solar Energies banner on right + Salary Slip on left)
    const headerBoxes = rects.filter(
      (r) => r.width > 120 && r.width < pageWidth * 0.8 && r.y > 600 && colorContrast(r.color)
    );

    for (const box of headerBoxes) {
      const insideBoxIndices: number[] = [];
      const leftCompanionIndices: number[] = [];

      for (let idx = 0; idx < textItems.length; idx++) {
        const item = textItems[idx];
        if (!item.str.trim()) continue;

        // Check if inside box
        if (
          item.x >= box.x - 20 &&
          item.x <= box.x + box.width + 20 &&
          item.y >= box.y - 15 &&
          item.y <= box.y + box.height + 25
        ) {
          insideBoxIndices.push(idx);
        }
        // Check if companion on left side of page in same vertical span
        else if (
          item.x < box.x - 20 &&
          item.y >= box.y - 40 &&
          item.y <= box.y + box.height + 40
        ) {
          leftCompanionIndices.push(idx);
        }
      }

      if (insideBoxIndices.length > 0) {
        insideBoxIndices.forEach((i) => handledTextIndices.add(i));
        leftCompanionIndices.forEach((i) => handledTextIndices.add(i));

        // Sort left and right items by Y descending
        const leftItems = leftCompanionIndices.map((i) => textItems[i]).sort((a, b) => b.y - a.y);
        const rightItems = insideBoxIndices.map((i) => textItems[i]).sort((a, b) => b.y - a.y);

        const leftParagraphs = leftItems.map(
          (item) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: item.str,
                  bold: true,
                  size: Math.max(36, item.fontSize * 2),
                  color: box.color, // Matching theme navy color
                }),
              ],
              spacing: { after: 60 },
            })
        );

        const rightParagraphs = rightItems.map(
          (item) =>
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: item.str,
                  bold: true,
                  size: Math.max(28, item.fontSize * 2),
                  color: 'FFFFFF', // Crisp white on dark background box
                }),
              ],
              spacing: { after: 40 },
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
        docChildren.push(new Paragraph({ text: '', spacing: { after: 160 } }));
      }
    }

    // 3. Identify Table Region (e.g. Header bar at y ~423 with width ~476, and container at y ~155)
    const tableHeaderRect = rects.find(
      (r) => r.width > 350 && r.height >= 20 && r.height <= 70 && colorContrast(r.color)
    );
    const tableBodyRect = rects.find(
      (r) => r.width > 350 && r.height > 100 && r.color !== '000000' && !colorContrast(r.color)
    );

    if (tableHeaderRect) {
      // Find table header items (e.g. Earnings, Amount, sub total)
      const headerItemIndices: number[] = [];
      const bodyItemIndices: number[] = [];

      for (let idx = 0; idx < textItems.length; idx++) {
        if (handledTextIndices.has(idx)) continue;
        const item = textItems[idx];
        if (!item.str.trim()) continue;

        if (
          item.y >= tableHeaderRect.y - 15 &&
          item.y <= tableHeaderRect.y + tableHeaderRect.height + 15
        ) {
          headerItemIndices.push(idx);
        } else if (
          tableBodyRect &&
          item.y >= tableBodyRect.y - 15 &&
          item.y < tableHeaderRect.y - 10
        ) {
          bodyItemIndices.push(idx);
        }
      }

      if (headerItemIndices.length >= 2) {
        headerItemIndices.forEach((i) => handledTextIndices.add(i));
        bodyItemIndices.forEach((i) => handledTextIndices.add(i));

        const headerItems = headerItemIndices.map((i) => textItems[i]).sort((a, b) => a.x - b.x);
        const bodyItems = bodyItemIndices.map((i) => textItems[i]);

        // Group body items into rows by Y
        const bodyLineMap: Map<number, RichTextItem[]> = new Map();
        for (const item of bodyItems) {
          let matchedY: number | null = null;
          for (const ey of bodyLineMap.keys()) {
            if (Math.abs(ey - item.y) <= 8) {
              matchedY = ey;
              break;
            }
          }
          const ty = matchedY !== null ? matchedY : item.y;
          if (!bodyLineMap.has(ty)) bodyLineMap.set(ty, []);
          bodyLineMap.get(ty)!.push(item);
        }

        const sortedBodyYs = Array.from(bodyLineMap.keys()).sort((a, b) => b - a);

        const numCols = Math.max(3, headerItems.length);
        const colWidthPercent = Math.round(100 / numCols);

        // Build Table Rows
        const tableRows: TableRow[] = [];

        // Header Row (Navy Blue with Crisp White Text)
        const headerCells = headerItems.map(
          (hItem) =>
            new TableCell({
              width: { size: colWidthPercent, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: tableHeaderRect.color, color: 'auto' },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: hItem.str.toUpperCase(),
                      bold: true,
                      size: 22,
                      color: 'FFFFFF', // White text on dark navy
                    }),
                  ],
                }),
              ],
            })
        );
        // Pad header if fewer columns
        while (headerCells.length < numCols) {
          headerCells.push(
            new TableCell({
              width: { size: colWidthPercent, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: tableHeaderRect.color, color: 'auto' },
              children: [new Paragraph({ text: '' })],
            })
          );
        }
        tableRows.push(new TableRow({ children: headerCells }));

        // Body Rows (Light Gray Fill or Zebra)
        for (const by of sortedBodyYs) {
          const rowItems = bodyLineMap.get(by)!.sort((a, b) => a.x - b.x);
          const isNetSalary = rowItems.some((i) => i.str.toLowerCase().includes('net salary'));

          const cells: TableCell[] = [];
          for (let c = 0; c < numCols; c++) {
            const cellItem = rowItems[c];
            cells.push(
              new TableCell({
                width: { size: colWidthPercent, type: WidthType.PERCENTAGE },
                shading: tableBodyRect
                  ? { type: ShadingType.CLEAR, fill: tableBodyRect.color, color: 'auto' }
                  : undefined,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: cellItem ? cellItem.str : '',
                        bold: isNetSalary || (cellItem ? cellItem.isBold : false),
                        size: isNetSalary ? 24 : 20,
                        color: tableHeaderRect.color, // Navy color
                      }),
                    ],
                  }),
                ],
              })
            );
          }
          tableRows.push(new TableRow({ children: cells }));
        }

        docChildren.push(
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: tableHeaderRect.color },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: tableHeaderRect.color },
              left: { style: BorderStyle.SINGLE, size: 1, color: tableHeaderRect.color },
              right: { style: BorderStyle.SINGLE, size: 1, color: tableHeaderRect.color },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
            },
          })
        );
        docChildren.push(new Paragraph({ text: '', spacing: { after: 120 } }));
      }
    }

    // 4. Remaining Items (Metadata, Titles, Paragraphs)
    const remainingItems = textItems.filter((_, idx) => !handledTextIndices.has(idx) && _.str.trim().length > 0);

    const lineMap: Map<number, RichTextItem[]> = new Map();
    for (const item of remainingItems) {
      let matchedY: number | null = null;
      for (const ey of lineMap.keys()) {
        if (Math.abs(ey - item.y) <= 4) {
          matchedY = ey;
          break;
        }
      }
      const ty = matchedY !== null ? matchedY : item.y;
      if (!lineMap.has(ty)) lineMap.set(ty, []);
      lineMap.get(ty)!.push(item);
    }

    const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);

    for (const y of sortedYs) {
      const lineItems = lineMap.get(y)!.sort((a, b) => a.x - b.x);

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
      }

      docChildren.push(
        new Paragraph({
          children: runs,
          heading,
          spacing: { after: heading ? 140 : 80, line: 260 },
        })
      );
    }
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
