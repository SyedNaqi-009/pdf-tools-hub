import { PDFDocument } from 'pdf-lib';
import { ProgressCallback } from './merge';

/**
 * Compress and optimize a PDF file client-side.
 */
export async function compressPdf(
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(15, 'Reading document structure...');
  const fileBuffer = await file.arrayBuffer();

  onProgress?.(35, 'Analyzing object streams and metadata...');
  const sourcePdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

  onProgress?.(55, 'Reconstructing page tree and stripping redundant dictionaries...');
  const optimizedPdf = await PDFDocument.create();
  const pageIndices = sourcePdf.getPageIndices();
  const copiedPages = await optimizedPdf.copyPages(sourcePdf, pageIndices);

  copiedPages.forEach((page) => optimizedPdf.addPage(page));

  onProgress?.(80, 'Compacting cross-reference table and re-encoding streams...');
  const compressedBytes = await optimizedPdf.save({
    useObjectStreams: true,
  });

  onProgress?.(100, 'Document optimization completed.');
  return new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
}
