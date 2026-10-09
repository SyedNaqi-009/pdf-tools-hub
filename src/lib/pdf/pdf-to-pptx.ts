import PptxGenJS from 'pptxgenjs';
import { ProgressCallback } from './merge';

/**
 * Convert PDF pages into a Microsoft PowerPoint presentation (.pptx).
 */
export async function pdfToPptx(
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(10, 'Initializing presentation engine...');
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const fileBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const percent = Math.round(15 + ((pageNum / numPages) * 70));
    onProgress?.(percent, `Creating slide ${pageNum} of ${numPages}...`);

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const slide = pptx.addSlide();

    // Extract text strings
    const strings: string[] = [];
    for (const item of textContent.items) {
      if ('str' in item && typeof item.str === 'string' && item.str.trim()) {
        strings.push(item.str.trim());
      }
    }

    const slideText = strings.join(' ');

    slide.addText(`Slide ${pageNum}`, {
      x: 0.5,
      y: 0.5,
      w: 8.5,
      h: 0.8,
      fontSize: 20,
      bold: true,
      color: '0F172A',
    });

    slide.addText(slideText || 'Page content', {
      x: 0.5,
      y: 1.5,
      w: 9.0,
      h: 4.5,
      fontSize: 12,
      color: '334155',
    });
  }

  onProgress?.(90, 'Generating PowerPoint file...');
  const pptxBlob = (await pptx.write({ outputType: 'blob' })) as Blob;

  onProgress?.(100, 'PowerPoint presentation generated successfully.');
  return pptxBlob;
}
