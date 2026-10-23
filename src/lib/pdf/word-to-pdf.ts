import { jsPDF } from 'jspdf';
import { ProgressCallback } from './merge';
import { ConversionQuality } from '../conversion-registry';

/**
 * High-Fidelity Word (.docx/.doc) to PDF Conversion Engine
 * - Parses rich structure (headings, bold, italic, tables, lists) using Mammoth HTML AST
 * - Renders styled text, headers, and real bordered tables into PDF
 * - Supports Low / Medium / High quality configurations
 */
export async function wordToPdf(
  file: File,
  quality: ConversionQuality = 'medium',
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(10, 'Initializing Microsoft Word document engine...');
  const mammoth = await import('mammoth');

  onProgress?.(25, 'Parsing document typography, tables, and styles...');
  const arrayBuffer = await file.arrayBuffer();

  let html = '';
  try {
    const result = await mammoth.convertToHtml({ arrayBuffer });
    html = result.value;
  } catch {
    // Fallback to raw text if HTML parsing encounters unusual structure
    const rawResult = await mammoth.extractRawText({ arrayBuffer });
    html = `<p>${rawResult.value.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`;
  }

  if (!html || !html.trim()) {
    throw new Error('The uploaded Word document appears to be empty or unreadable.');
  }

  onProgress?.(55, 'Rendering formatted elements & tables into PDF vector layout...');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
    compress: quality !== 'high',
  });

  const margin = 50;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
      return true;
    }
    return false;
  };

  // Parse HTML into blocks: headings, paragraphs, tables, lists
  // Since we are in browser/Node without DOMParser guaranteed in all contexts,
  // we do clean regex/string block tokenization:
  const blockRegex = /<(h[1-6]|p|table|ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  let foundBlocks = 0;

  while ((match = blockRegex.exec(html)) !== null) {
    foundBlocks++;
    const tag = match[1].toLowerCase();
    const content = match[2];

    if (tag.startsWith('h')) {
      // Heading
      const level = parseInt(tag[1], 10);
      const fontSize = level === 1 ? 18 : level === 2 ? 15 : 12;
      checkPageBreak(fontSize * 2 + 10);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(fontSize);
      doc.setTextColor(15, 23, 42); // slate-900

      const plainText = content.replace(/<[^>]+>/g, '').trim();
      const lines = doc.splitTextToSize(plainText, contentWidth);
      for (const line of lines) {
        checkPageBreak(fontSize + 6);
        doc.text(line, margin, cursorY);
        cursorY += fontSize + 6;
      }
      cursorY += 8;
    } else if (tag === 'table') {
      // Table rendering
      checkPageBreak(40);
      const rowMatches = content.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
      const tableData: string[][] = [];

      for (const rowHtml of rowMatches) {
        const cellMatches = rowHtml.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
        const rowCells = cellMatches.map((c) =>
          c.replace(/<[^>]+>/g, '').trim()
        );
        if (rowCells.length > 0) {
          tableData.push(rowCells);
        }
      }

      if (tableData.length > 0) {
        const numCols = Math.max(...tableData.map((r) => r.length));
        const colWidth = contentWidth / numCols;
        const rowHeight = 22;

        tableData.forEach((row, rIdx) => {
          checkPageBreak(rowHeight);
          const isHeader = rIdx === 0;

          // Header background
          if (isHeader && quality !== 'low') {
            doc.setFillColor(241, 245, 249); // slate-100
            doc.rect(margin, cursorY - 14, contentWidth, rowHeight, 'F');
          }

          doc.setFont('Helvetica', isHeader ? 'bold' : 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(isHeader ? 15 : 51, isHeader ? 23 : 65, isHeader ? 42 : 85);

          for (let c = 0; c < numCols; c++) {
            const cellText = row[c] || '';
            const cellX = margin + c * colWidth;

            // Cell border
            doc.setDrawColor(226, 232, 240); // slate-200
            doc.rect(cellX, cursorY - 14, colWidth, rowHeight, 'S');

            // Cell text truncated to fit column
            const maxChars = Math.floor(colWidth / 5.5);
            const display = cellText.length > maxChars ? cellText.slice(0, maxChars - 2) + '..' : cellText;
            doc.text(display, cellX + 6, cursorY);
          }
          cursorY += rowHeight;
        });
        cursorY += 10;
      }
    } else if (tag === 'ul' || tag === 'ol') {
      // List rendering
      const liMatches = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
      liMatches.forEach((li, idx) => {
        checkPageBreak(18);
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);

        const itemText = li.replace(/<[^>]+>/g, '').trim();
        const bullet = tag === 'ol' ? `${idx + 1}. ` : '• ';
        const lines = doc.splitTextToSize(itemText, contentWidth - 18);

        for (let l = 0; l < lines.length; l++) {
          checkPageBreak(15);
          if (l === 0) {
            doc.text(bullet, margin + 4, cursorY);
          }
          doc.text(lines[l], margin + 20, cursorY);
          cursorY += 15;
        }
      });
      cursorY += 6;
    } else {
      // Paragraph
      const plainText = content.replace(/<[^>]+>/g, '').trim();
      if (!plainText) continue;

      const isBold = /<(strong|b)[^>]*>/i.test(content);
      const isItalic = /<(em|i)[^>]*>/i.test(content);

      doc.setFont('Helvetica', isBold ? (isItalic ? 'bolditalic' : 'bold') : (isItalic ? 'italic' : 'normal'));
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);

      const lines = doc.splitTextToSize(plainText, contentWidth);
      for (const line of lines) {
        checkPageBreak(16);
        doc.text(line, margin, cursorY);
        cursorY += 16;
      }
      cursorY += 6;
    }
  }

  // If no HTML tags were matched (e.g. plain text file), fallback to text split
  if (foundBlocks === 0) {
    const plain = html.replace(/<[^>]+>/g, '').trim();
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    const lines = doc.splitTextToSize(plain, contentWidth);
    for (const line of lines) {
      checkPageBreak(18);
      doc.text(line, margin, cursorY);
      cursorY += 18;
    }
  }

  onProgress?.(92, 'Generating finalized PDF binary stream...');
  const pdfBlob = doc.output('blob');
  onProgress?.(100, 'Word to PDF conversion completed successfully.');
  return pdfBlob;
}
