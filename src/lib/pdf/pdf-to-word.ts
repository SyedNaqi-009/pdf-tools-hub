import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { ProgressCallback } from './merge';

/**
 * Convert a PDF file into an editable Microsoft Word (.docx) document.
 */
export async function pdfToWord(
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(10, 'Initializing document parser...');
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const fileBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const docParagraphs: Paragraph[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const percent = Math.round(15 + ((pageNum / numPages) * 65));
    onProgress?.(percent, `Extracting text from page ${pageNum} of ${numPages}...`);

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Add page break header if not first page
    if (pageNum > 1) {
      docParagraphs.push(
        new Paragraph({
          text: `--- Page ${pageNum} ---`,
          heading: HeadingLevel.HEADING_3,
        })
      );
    }

    let currentLine = '';
    let lastY: number | null = null;

    for (const item of textContent.items) {
      if ('str' in item && typeof item.str === 'string') {
        const itemY = 'transform' in item ? item.transform[5] : 0;

        if (lastY !== null && Math.abs(itemY - lastY) > 5) {
          if (currentLine.trim()) {
            docParagraphs.push(
              new Paragraph({
                children: [new TextRun(currentLine.trim())],
                spacing: { after: 120 },
              })
            );
          }
          currentLine = item.str;
        } else {
          currentLine += (currentLine ? ' ' : '') + item.str;
        }
        lastY = itemY;
      }
    }

    if (currentLine.trim()) {
      docParagraphs.push(
        new Paragraph({
          children: [new TextRun(currentLine.trim())],
          spacing: { after: 120 },
        })
      );
    }
  }

  onProgress?.(85, 'Packaging into Microsoft Word OpenXML (.docx) format...');
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docParagraphs.length > 0 ? docParagraphs : [
          new Paragraph({
            children: [new TextRun('No text detected in the provided PDF.')],
          }),
        ],
      },
    ],
  });

  const docxBlob = await Packer.toBlob(doc);
  onProgress?.(100, 'Word document generated successfully.');
  return docxBlob;
}
