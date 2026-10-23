import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import { ProgressCallback } from './merge';
import { ConversionQuality } from '../conversion-registry';

interface ExtractedTextItem {
  str: string;
  x: number;
  y: number;
  fontSize: number;
  fontName: string;
  isBold: boolean;
  isItalic: boolean;
}

/**
 * High-Fidelity PDF to Word (.docx) Conversion Engine
 * - Strips converter-generated "Page 1" artifacts
 * - Preserves font styles: bold, italic, font size hierarchy
 * - Reconstructs tabular rows into editable Word tables
 * - Flows quality presets into extraction fidelity
 */
export async function pdfToWord(
  file: File,
  quality: ConversionQuality = 'medium',
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(8, 'Initializing high-fidelity PDF parser...');
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const fileBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const docChildren: (Paragraph | Table)[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const percent = Math.round(12 + ((pageNum / numPages) * 70));
    onProgress?.(percent, `Analyzing structural layout & typography (page ${pageNum} of ${numPages})...`);

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    const items: ExtractedTextItem[] = [];

    for (const rawItem of textContent.items) {
      if ('str' in rawItem && typeof rawItem.str === 'string' && rawItem.str.length > 0) {
        const x = 'transform' in rawItem ? rawItem.transform[4] : 0;
        const y = 'transform' in rawItem ? Math.round(rawItem.transform[5]) : 0;
        const fontSize = 'transform' in rawItem ? Math.round(Math.abs(rawItem.transform[0])) : 11;
        const fontName = ('fontName' in rawItem && typeof rawItem.fontName === 'string' ? rawItem.fontName : '').toLowerCase();

        const isBold = fontName.includes('bold') || fontName.includes('black') || fontName.includes('heavy') || fontName.includes('700') || fontName.includes('800') || fontName.includes('900');
        const isItalic = fontName.includes('italic') || fontName.includes('oblique') || fontName.includes('slant');

        items.push({
          str: rawItem.str,
          x,
          y,
          fontSize,
          fontName,
          isBold,
          isItalic,
        });
      }
    }

    if (items.length === 0) {
      continue;
    }

    // Group items into horizontal lines (by Y coordinate within tolerance of 4pt)
    const lineMap: Map<number, ExtractedTextItem[]> = new Map();
    for (const item of items) {
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

    // Sort lines vertically from top to bottom
    const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);

    // Analyze lines: detect tables vs standard text paragraphs
    let currentTableRows: ExtractedTextItem[][] = [];

    const flushTable = () => {
      if (currentTableRows.length === 0) return;

      if (currentTableRows.length === 1 && currentTableRows[0].length <= 1) {
        // Just single item, emit as paragraph
        const single = currentTableRows[0][0];
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: single.str,
                bold: single.isBold,
                italics: single.isItalic,
                size: Math.max(18, single.fontSize * 2),
              }),
            ],
            spacing: { after: 120 },
          })
        );
        currentTableRows = [];
        return;
      }

      // Reconstruct genuine Word Table
      const maxCols = Math.max(...currentTableRows.map((r) => r.length));
      const tableRows = currentTableRows.map((rowItems, rIdx) => {
        const cells: TableCell[] = [];
        for (let c = 0; c < maxCols; c++) {
          const item = rowItems[c];
          cells.push(
            new TableCell({
              width: { size: Math.round(100 / maxCols), type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: item ? item.str : '',
                      bold: item ? (rIdx === 0 ? true : item.isBold) : false,
                      italics: item ? item.isItalic : false,
                      size: item ? Math.max(16, item.fontSize * 1.8) : 20,
                    }),
                  ],
                }),
              ],
              shading: rIdx === 0 && quality !== 'low' ? { fill: 'F1F5F9' } : undefined,
            })
          );
        }
        return new TableRow({ children: cells });
      });

      docChildren.push(
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
            left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
            right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
          },
        })
      );
      // Spacing after table
      docChildren.push(new Paragraph({ text: '', spacing: { after: 140 } }));
      currentTableRows = [];
    };

    for (const y of sortedYs) {
      const lineItems = lineMap.get(y)!;
      lineItems.sort((a, b) => a.x - b.x);

      // Check if line looks like a table row: has 2+ distinct horizontal items separated by gaps > 40pt
      let isTableRow = false;
      if (lineItems.length >= 2) {
        let hasGaps = false;
        for (let i = 1; i < lineItems.length; i++) {
          if (lineItems[i].x - (lineItems[i - 1].x + lineItems[i - 1].str.length * 5) > 25) {
            hasGaps = true;
            break;
          }
        }
        if (hasGaps) isTableRow = true;
      }

      if (isTableRow && quality !== 'low') {
        currentTableRows.push(lineItems);
        continue;
      } else {
        flushTable();
      }

      // Check for Heading by font size
      const maxFontInLine = Math.max(...lineItems.map((i) => i.fontSize));
      let heading: typeof HeadingLevel[keyof typeof HeadingLevel] | undefined;
      if (maxFontInLine >= 18) {
        heading = HeadingLevel.HEADING_1;
      } else if (maxFontInLine >= 14) {
        heading = HeadingLevel.HEADING_2;
      } else if (maxFontInLine >= 12 && lineItems.some((i) => i.isBold)) {
        heading = HeadingLevel.HEADING_3;
      }

      // Build runs with preserved bold, italic, and spacing
      const runs: TextRun[] = [];
      for (let i = 0; i < lineItems.length; i++) {
        const item = lineItems[i];
        runs.push(
          new TextRun({
            text: (i > 0 ? ' ' : '') + item.str,
            bold: item.isBold,
            italics: item.isItalic,
            size: Math.max(18, item.fontSize * 2), // Word uses half-points
          })
        );
      }

      docChildren.push(
        new Paragraph({
          children: runs,
          heading,
          spacing: { after: heading ? 180 : 120, line: 276 },
          // Insert clean page break between pages WITHOUT printing "Page 1" text!
          pageBreakBefore: pageNum > 1 && docChildren.length === 0,
        })
      );
    }

    flushTable();
  }

  onProgress?.(88, 'Packaging into Microsoft Word OpenXML (.docx) container...');
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren.length > 0 ? docChildren : [
          new Paragraph({
            children: [new TextRun('No text detected in the provided PDF.')],
          }),
        ],
      },
    ],
  });

  const docxBlob = await Packer.toBlob(doc);
  onProgress?.(100, 'Word document generated with preserved formatting.');
  return docxBlob;
}
