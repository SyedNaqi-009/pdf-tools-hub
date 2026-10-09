import { PDFDocument } from 'pdf-lib';
import { ProgressCallback } from './merge';

export interface FormFieldValue {
  name: string;
  value: string;
}

/**
 * Detect and fill form fields in a PDF document, then flatten the form.
 */
export async function fillPdfForms(
  file: File,
  fieldValues: Record<string, string>,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(20, 'Loading interactive form fields...');
  const fileBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  onProgress?.(50, `Updating ${Object.keys(fieldValues).length} form fields...`);
  for (const field of fields) {
    const fieldName = field.getName();
    if (fieldName in fieldValues) {
      try {
        const val = fieldValues[fieldName];
        if ('setText' in field && typeof (field as { setText: (text: string) => void }).setText === 'function') {
          (field as { setText: (text: string) => void }).setText(val);
        }
      } catch {
        // Continue if field is not a standard text field
      }
    }
  }

  onProgress?.(80, 'Flattening interactive form...');
  try {
    form.flatten();
  } catch {
    // If form has no active fields to flatten
  }

  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, 'Form successfully filled and flattened.');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

/**
 * Get field names from an interactive PDF form.
 */
export async function getFormFields(file: File): Promise<string[]> {
  const fileBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  return form.getFields().map((f) => f.getName());
}
