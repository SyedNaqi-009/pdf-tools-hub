import { ProgressCallback } from './merge';

export interface PdfToImageOptions {
  format: 'image/jpeg' | 'image/png';
  quality?: number;
  scale?: number;
}

/**
 * Convert PDF pages to high-resolution JPG or PNG image blobs.
 */
export async function pdfToImage(
  file: File,
  options: PdfToImageOptions,
  onProgress?: ProgressCallback
): Promise<Blob[]> {
  onProgress?.(10, 'Initializing PDF rendering engine...');
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const fileBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const results: Blob[] = [];
  const scale = options.scale ?? 2.0; // 2x for sharp retina rendering

  for (let i = 1; i <= numPages; i++) {
    const percent = Math.round(15 + ((i / numPages) * 80));
    onProgress?.(percent, `Rendering page ${i} of ${numPages}...`);

    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas 2D context not available.');
    }

    // For JPG, ensure clean white background
    if (options.format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await (page.render as (params: unknown) => { promise: Promise<void> })(renderContext).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error(`Failed to convert page ${i} to image.`));
        },
        options.format,
        options.quality ?? 0.85
      );
    });

    results.push(blob);
  }

  onProgress?.(100, `Successfully rendered ${numPages} page images.`);
  return results;
}
