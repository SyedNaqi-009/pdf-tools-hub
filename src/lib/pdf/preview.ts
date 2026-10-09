import { ProgressCallback } from './merge';

export interface DocumentPreviewInfo {
  numPages: number;
  fingerprint: string;
}

/**
 * Inspect and load PDF document information for in-browser previewing.
 */
export async function loadPdfPreview(
  file: File,
  onProgress?: ProgressCallback
): Promise<DocumentPreviewInfo> {
  onProgress?.(20, 'Loading document into preview renderer...');
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const fileBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) });
  const pdfDoc = await loadingTask.promise;

  onProgress?.(100, `Loaded document with ${pdfDoc.numPages} pages.`);
  return {
    numPages: pdfDoc.numPages,
    fingerprint: typeof pdfDoc.fingerprints?.[0] === 'string' ? pdfDoc.fingerprints[0] : file.name,
  };
}

/**
 * Render a specific page of a PDF file to a target canvas element.
 */
export async function renderPdfPageToCanvas(
  file: File,
  pageNum: number,
  canvas: HTMLCanvasElement,
  scale: number = 1.5
): Promise<void> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const fileBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) });
  const pdfDoc = await loadingTask.promise;

  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale });

  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context.');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
  };

  await (page.render as (params: unknown) => { promise: Promise<void> })(renderContext).promise;
}
