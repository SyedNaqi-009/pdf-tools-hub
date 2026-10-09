import { ProgressCallback } from './merge';

/**
 * Generate a thumbnail PNG image of the first page (or specified page) of a PDF.
 */
export async function generatePdfThumbnail(
  file: File,
  pageNum: number = 1,
  width: number = 400,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(20, 'Loading PDF for thumbnail rendering...');
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const fileBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) });
  const pdfDoc = await loadingTask.promise;

  onProgress?.(50, `Rendering thumbnail for page ${pageNum}...`);
  const page = await pdfDoc.getPage(pageNum);
  const unscaledViewport = page.getViewport({ scale: 1 });
  const scale = width / unscaledViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available.');
  }

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
  };

  await (page.render as (params: unknown) => { promise: Promise<void> })(renderContext).promise;

  onProgress?.(85, 'Exporting thumbnail image...');
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to generate thumbnail blob.'));
      },
      'image/png'
    );
  });

  onProgress?.(100, 'Thumbnail generated successfully.');
  return blob;
}
