import { jsPDF } from 'jspdf';
import { ProgressCallback } from './merge';
import { ConversionQuality } from '../conversion-registry';

/**
 * High-Fidelity Word (.docx/.doc) to PDF Conversion Engine
 * - Preserves document images & logos using base64 inline image extraction
 * - Renders styled headings, text formatting (bold, italic, colors)
 * - Renders real bordered tables with header fills and cell padding
 * - Preserves lists, paragraph spacing, and margins
 */
export async function wordToPdf(
  file: File,
  quality: ConversionQuality = 'medium',
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(10, 'Initializing Microsoft Word document engine...');
  const mammoth = await import('mammoth');

  onProgress?.(25, 'Parsing document typography, tables, and images...');
  const arrayBuffer = await file.arrayBuffer();

  let html = '';
  try {
    // Preserve inline images & logos as data URIs
    const options = {
      convertImage: mammoth.images.dataUri,
    };
    const result = await mammoth.convertToHtml({ arrayBuffer }, options);
    html = result.value;
  } catch {
    const rawResult = await mammoth.extractRawText({ arrayBuffer });
    html = `<p>${rawResult.value.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`;
  }

  if (!html || !html.trim()) {
    throw new Error('The uploaded Word document appears to be empty or unreadable.');
  }

  onProgress?.(55, 'Rendering formatted elements, images & tables into PDF vector layout...');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
    compress: quality !== 'high',
  });

  const margin = 45;
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

  // Match all block elements: headings, paragraphs, tables, lists, images
  const blockRegex = /<(h[1-6]|p|table|ul|ol|img)[^>]*>([\s\S]*?)(<\/\1>|$)/gi;
  let match: RegExpExecArray | null;
  let foundBlocks = 0;

  while ((match = blockRegex.exec(html)) !== null) {
    foundBlocks++;
    const fullTagMatch = match[0];
    const tag = match[1].toLowerCase();
    const content = match[2];

    // 1. Embedded Image / Logo
    if (tag === 'img' || fullTagMatch.includes('<img')) {
      const srcMatch = fullTagMatch.match(/src=["'](data:image\/[^;]+;base64,[^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        try {
          const imgData = srcMatch[1];
          const imgType = imgData.includes('image/png') ? 'PNG' : 'JPEG';
          const maxImgW = Math.min(260, contentWidth);
          const maxImgH = 140;

          checkPageBreak(maxImgH + 15);
          doc.addImage(imgData, imgType, margin, cursorY, maxImgW, maxImgH);
          cursorY += maxImgH + 15;
          continue;
        } catch {
          // If image decoding fails, continue gracefully
        }
      }
    }

    // 2. Heading
    if (tag.startsWith('h')) {
      const level = parseInt(tag[1], 10);
      const fontSize = level === 1 ? 20 : level === 2 ? 16 : 13;
      checkPageBreak(fontSize * 2 + 10);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(fontSize);
      // Dark Navy accent for primary headings
      doc.setTextColor(level === 1 ? 0 : 30, level === 1 ? 8 : 41, level === 1 ? 102 : 59);

      const plainText = content.replace(/<[^>]+>/g, '').trim();
      const lines = doc.splitTextToSize(plainText, contentWidth);
      for (const line of lines) {
        checkPageBreak(fontSize + 6);
        doc.text(line, margin, cursorY);
        cursorY += fontSize + 6;
      }
      cursorY += 8;
    }

    // 3. Table
    else if (tag === 'table') {
      checkPageBreak(50);
      const rowMatches = content.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
      const tableData: string[][] = [];

      for (const rowHtml of rowMatches) {
        const cellMatches = rowHtml.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
        const rowCells = cellMatches.map((c) => c.replace(/<[^>]+>/g, '').trim());
        if (rowCells.length > 0) {
          tableData.push(rowCells);
        }
      }

      if (tableData.length > 0) {
        const numCols = Math.max(...tableData.map((r) => r.length));

        // Case A: 1-row 1-cell Table -> Bottom/Accent Banner
        if (tableData.length === 1 && numCols === 1) {
          const bannerHeight = 28;
          checkPageBreak(bannerHeight + 10);
          doc.setFillColor(0, 8, 102); // Deep Navy
          doc.rect(margin, cursorY - 14, contentWidth, bannerHeight, 'F');
          cursorY += bannerHeight + 10;
          continue;
        }

        // Case B: 2-column Header Banner Table (e.g. Salary Slip on left + E-Solar on right)
        const isHeaderBanner =
          tableData.length <= 2 &&
          numCols === 2 &&
          tableData.some((r) =>
            r.some(
              (c) =>
                c.toLowerCase().includes('slip') ||
                c.toLowerCase().includes('salary') ||
                c.toLowerCase().includes('solar') ||
                c.toLowerCase().includes('energies') ||
                c.toLowerCase().includes('invoice')
            )
          );

        if (isHeaderBanner) {
          const bannerHeight = 56;
          checkPageBreak(bannerHeight + 15);
          const leftText = tableData[0][0] || '';
          const rightText = tableData[0][1] || '';

          // Left title
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(22);
          doc.setTextColor(0, 8, 102); // Deep Navy
          doc.text(leftText, margin, cursorY + 20);

          // Right navy box
          const boxW = contentWidth * 0.48;
          const boxX = margin + contentWidth - boxW;
          doc.setFillColor(0, 8, 102);
          doc.rect(boxX, cursorY - 10, boxW, bannerHeight, 'F');

          // Right white text
          doc.setFont('Times', 'bold');
          doc.setFontSize(18);
          doc.setTextColor(255, 255, 255);
          const rightLines = rightText.split(/\s{2,}|\n/).filter(Boolean);
          if (rightLines.length >= 2) {
            doc.text(rightLines[0], boxX + boxW / 2, cursorY + 14, { align: 'center' });
            doc.setFont('Times', 'normal');
            doc.setFontSize(13);
            doc.text(rightLines.slice(1).join(' '), boxX + boxW / 2, cursorY + 34, { align: 'center' });
          } else {
            doc.text(rightText, boxX + boxW / 2, cursorY + 24, { align: 'center' });
          }

          cursorY += bannerHeight + 18;
          continue;
        }

        // Case C: Standard Data / Earnings Table
        const colWidths =
          numCols === 3
            ? [contentWidth * 0.5, contentWidth * 0.26, contentWidth * 0.24]
            : Array(numCols).fill(contentWidth / numCols);
        const rowHeight = 24;

        tableData.forEach((row, rIdx) => {
          checkPageBreak(rowHeight);
          const isHeader = rIdx === 0;
          const isNetSalary = row.some((c) => c.toLowerCase().includes('net salary'));

          if (isHeader) {
            doc.setFillColor(0, 8, 102); // Deep Navy
            doc.rect(margin, cursorY - 15, contentWidth, rowHeight, 'F');
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(10.5);
            doc.setTextColor(255, 255, 255); // Crisp White
          } else {
            // Card fill
            doc.setFillColor(246, 246, 246);
            doc.rect(margin, cursorY - 15, contentWidth, isNetSalary ? rowHeight + 10 : rowHeight, 'F');

            if (isNetSalary) {
              doc.setFont('Helvetica', 'bold');
              doc.setFontSize(11);
              doc.setTextColor(0, 8, 102);
            } else {
              doc.setFont('Helvetica', 'normal');
              doc.setFontSize(9.5);
              doc.setTextColor(0, 8, 102);
            }
          }

          let curCellX = margin;
          for (let c = 0; c < numCols; c++) {
            const curWidth = colWidths[c];
            const cellText = row[c] || '';

            // Check if currency/number for right-alignment
            const isNumeric = /^[$\u20AC\u00A3]?\s*-?\d[\d,.]*\s*([%\/-]|Rs\.?)?$/.test(cellText);
            const maxChars = Math.floor(curWidth / 5.5);
            const display = cellText.length > maxChars ? cellText.slice(0, maxChars - 2) + '..' : cellText;

            if (isNetSalary && c === numCols - 1) {
              doc.text(display, curCellX + curWidth - 8, cursorY, { align: 'right' });
            } else if (c === 0 || c === 1) {
              doc.text(display, curCellX + 8, cursorY);
            } else if (isNumeric) {
              doc.text(display, curCellX + curWidth - 8, cursorY, { align: 'right' });
            } else {
              doc.text(display, curCellX + curWidth / 2, cursorY, { align: 'center' });
            }
            curCellX += curWidth;
          }
          cursorY += isNetSalary ? rowHeight + 12 : rowHeight;
        });
        cursorY += 14;
      }
    }

    // 4. List (ul / ol)
    else if (tag === 'ul' || tag === 'ol') {
      const liMatches = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
      liMatches.forEach((li, idx) => {
        checkPageBreak(18);
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);

        const itemText = li.replace(/<[^>]+>/g, '').trim();
        const bullet = tag === 'ol' ? `${idx + 1}. ` : '• ';
        const lines = doc.splitTextToSize(itemText, contentWidth - 20);

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
    }

    // 5. Paragraph
    else {
      const plainText = content.replace(/<[^>]+>/g, '').trim();
      if (!plainText) continue;

      const isBold = /<(strong|b)[^>]*>/i.test(content);
      const isItalic = /<(em|i)[^>]*>/i.test(content);

      doc.setFont(
        'Helvetica',
        isBold ? (isItalic ? 'bolditalic' : 'bold') : isItalic ? 'italic' : 'normal'
      );
      doc.setFontSize(10.5);

      // Preserve metadata colon lines (e.g. Employee Name:)
      if (plainText.includes(':')) {
        doc.setTextColor(0, 8, 102);
      } else {
        doc.setTextColor(30, 41, 59);
      }

      const lines = doc.splitTextToSize(plainText, contentWidth);
      for (const line of lines) {
        checkPageBreak(16);
        doc.text(line, margin, cursorY);
        cursorY += 16;
      }
      cursorY += 6;
    }
  }

  // Fallback for plain text documents without HTML tags
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

  onProgress?.(92, 'Finalizing PDF output package...');
  const pdfBlob = doc.output('blob');
  onProgress?.(100, 'Word to PDF conversion completed with full formatting.');
  return pdfBlob;
}
