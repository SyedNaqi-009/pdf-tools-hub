/**
 * Universal Conversion Capability Registry
 * Maps input file MIME types, extensions, and magic numbers to valid, genuinely supported operations.
 */

export type ConversionQuality = 'low' | 'medium' | 'high';

export interface QualityPresetInfo {
  label: string;
  description: string;
  badge: string;
}

export const QUALITY_PRESETS: Record<ConversionQuality, QualityPresetInfo> = {
  low: {
    label: 'Low / Maximum Compression',
    description: 'Smallest file size with optimized images and compact structure.',
    badge: 'Smallest Size',
  },
  medium: {
    label: 'Medium / Balanced (Recommended)',
    description: 'Balanced visual fidelity, formatted text, and reasonable file size.',
    badge: 'Balanced',
  },
  high: {
    label: 'High / Maximum Fidelity',
    description: 'Highest preservation of document resolution, styling, and graphics.',
    badge: 'Best Quality',
  },
};

export interface ConversionOperation {
  id: string;
  label: string;
  description: string;
  outputFormat: string;
  outputExtension: string;
  outputMimeType: string;
  targetRoute: string;
  supportsQuality: boolean;
  category: 'convert' | 'core' | 'security' | 'utility';
}

export interface DetectedFileType {
  mime: string;
  extension: string;
  category: 'pdf' | 'word' | 'excel' | 'powerpoint' | 'image' | 'unknown';
  label: string;
  iconSlug: string;
}

/**
 * Detect file type accurately using extension, MIME type, and magic numbers where practical
 */
export async function detectFileType(file: File): Promise<DetectedFileType> {
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  const mime = file.type.toLowerCase();

  // Inspect first 8 bytes (magic number)
  let magicHex = '';
  try {
    const slice = file.slice(0, 8);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    magicHex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  } catch {
    // fallback to extension & mime
  }

  // 1. PDF: %PDF- (hex: 25 50 44 46)
  if (magicHex.startsWith('25504446') || ext === '.pdf' || mime === 'application/pdf') {
    return {
      mime: 'application/pdf',
      extension: '.pdf',
      category: 'pdf',
      label: 'PDF Document',
      iconSlug: 'pdf-to-word',
    };
  }

  // 2. Word (.docx / .doc):
  // .docx is a ZIP (hex: 50 4B 03 04) with word/document.xml
  // .doc is CFBF (hex: D0 CF 11 E0)
  if (
    ext === '.docx' ||
    ext === '.doc' ||
    mime.includes('wordprocessingml') ||
    mime.includes('msword')
  ) {
    return {
      mime: mime || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extension: ext || '.docx',
      category: 'word',
      label: ext === '.doc' ? 'Microsoft Word (.doc)' : 'Microsoft Word (.docx)',
      iconSlug: 'word-to-pdf',
    };
  }

  // 3. Excel (.xlsx / .xls):
  if (
    ext === '.xlsx' ||
    ext === '.xls' ||
    mime.includes('spreadsheetml') ||
    mime.includes('ms-excel')
  ) {
    return {
      mime: mime || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extension: ext || '.xlsx',
      category: 'excel',
      label: ext === '.xls' ? 'Microsoft Excel (.xls)' : 'Microsoft Excel (.xlsx)',
      iconSlug: 'excel-to-pdf',
    };
  }

  // 4. PowerPoint (.pptx / .ppt):
  if (
    ext === '.pptx' ||
    ext === '.ppt' ||
    mime.includes('presentationml') ||
    mime.includes('ms-powerpoint')
  ) {
    return {
      mime: mime || 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      extension: ext || '.pptx',
      category: 'powerpoint',
      label: ext === '.ppt' ? 'Microsoft PowerPoint (.ppt)' : 'Microsoft PowerPoint (.pptx)',
      iconSlug: 'powerpoint-to-pdf',
    };
  }

  // 5. Images (.jpg, .jpeg, .png, .webp):
  if (
    magicHex.startsWith('FFD8FF') ||
    ext === '.jpg' ||
    ext === '.jpeg' ||
    mime === 'image/jpeg'
  ) {
    return {
      mime: 'image/jpeg',
      extension: '.jpg',
      category: 'image',
      label: 'JPEG Image (.jpg)',
      iconSlug: 'jpg-to-pdf',
    };
  }

  if (
    magicHex.startsWith('89504E47') ||
    ext === '.png' ||
    mime === 'image/png'
  ) {
    return {
      mime: 'image/png',
      extension: '.png',
      category: 'image',
      label: 'PNG Image (.png)',
      iconSlug: 'png-to-pdf',
    };
  }

  if (ext === '.webp' || mime === 'image/webp') {
    return {
      mime: 'image/webp',
      extension: '.webp',
      category: 'image',
      label: 'WebP Image (.webp)',
      iconSlug: 'jpg-to-pdf',
    };
  }

  return {
    mime: mime || 'application/octet-stream',
    extension: ext || '',
    category: 'unknown',
    label: 'Unsupported File Format',
    iconSlug: 'merge-pdf',
  };
}

/**
 * Returns the list of genuinely supported conversion operations for a detected file category
 */
export function getAvailableOperations(fileType: DetectedFileType): ConversionOperation[] {
  switch (fileType.category) {
    case 'pdf':
      return [
        {
          id: 'pdf-to-word',
          label: 'PDF to Word (.docx)',
          description: 'Convert PDF into an editable Microsoft Word document with preserved layout & tables.',
          outputFormat: 'DOCX',
          outputExtension: 'docx',
          outputMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          targetRoute: '/tools/pdf-to-word',
          supportsQuality: true,
          category: 'convert',
        },
        {
          id: 'pdf-to-excel',
          label: 'PDF to Excel (.xlsx)',
          description: 'Extract tables and data rows into structured Microsoft Excel spreadsheets.',
          outputFormat: 'XLSX',
          outputExtension: 'xlsx',
          outputMimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          targetRoute: '/tools/pdf-to-excel',
          supportsQuality: true,
          category: 'convert',
        },
        {
          id: 'pdf-to-powerpoint',
          label: 'PDF to PowerPoint (.pptx)',
          description: 'Convert PDF pages into editable Microsoft PowerPoint presentation slides.',
          outputFormat: 'PPTX',
          outputExtension: 'pptx',
          outputMimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          targetRoute: '/tools/pdf-to-powerpoint',
          supportsQuality: true,
          category: 'convert',
        },
        {
          id: 'pdf-to-jpg',
          label: 'PDF to JPG Images',
          description: 'Render and extract high-resolution JPEG images of each PDF page.',
          outputFormat: 'JPG',
          outputExtension: 'jpg',
          outputMimeType: 'image/jpeg',
          targetRoute: '/tools/pdf-to-jpg',
          supportsQuality: true,
          category: 'convert',
        },
        {
          id: 'pdf-to-png',
          label: 'PDF to PNG Images',
          description: 'Render PDF pages into crystal-clear lossless PNG images with transparent backgrounds.',
          outputFormat: 'PNG',
          outputExtension: 'png',
          outputMimeType: 'image/png',
          targetRoute: '/tools/pdf-to-png',
          supportsQuality: true,
          category: 'convert',
        },
        {
          id: 'compress-pdf',
          label: 'Compress PDF',
          description: 'Reduce file size using smart stream compaction and image optimization.',
          outputFormat: 'PDF',
          outputExtension: 'pdf',
          outputMimeType: 'application/pdf',
          targetRoute: '/tools/compress-pdf',
          supportsQuality: true,
          category: 'core',
        },
        {
          id: 'translate-pdf',
          label: 'Translate PDF',
          description: 'Translate document contents into 24+ languages with timeout-safe processing.',
          outputFormat: 'PDF',
          outputExtension: 'pdf',
          outputMimeType: 'application/pdf',
          targetRoute: '/tools/translate-pdf',
          supportsQuality: false,
          category: 'convert',
        },
        {
          id: 'split-pdf',
          label: 'Split PDF Pages',
          description: 'Separate pages or specific ranges into individual PDF documents.',
          outputFormat: 'PDF',
          outputExtension: 'pdf',
          outputMimeType: 'application/pdf',
          targetRoute: '/tools/split-pdf',
          supportsQuality: false,
          category: 'core',
        },
        {
          id: 'rotate-pdf',
          label: 'Rotate PDF',
          description: 'Permanently rotate PDF pages by 90, 180, or 270 degrees.',
          outputFormat: 'PDF',
          outputExtension: 'pdf',
          outputMimeType: 'application/pdf',
          targetRoute: '/tools/rotate-pdf',
          supportsQuality: false,
          category: 'core',
        },
        {
          id: 'protect-pdf',
          label: 'Password Protect PDF',
          description: 'Encrypt PDF with AES password protection to prevent unauthorized viewing.',
          outputFormat: 'PDF',
          outputExtension: 'pdf',
          outputMimeType: 'application/pdf',
          targetRoute: '/tools/protect-pdf',
          supportsQuality: false,
          category: 'security',
        },
      ];

    case 'word':
      return [
        {
          id: 'word-to-pdf',
          label: 'Word to PDF (.pdf)',
          description: 'Convert Microsoft Word (.docx/.doc) into a professional, layout-preserved PDF.',
          outputFormat: 'PDF',
          outputExtension: 'pdf',
          outputMimeType: 'application/pdf',
          targetRoute: '/tools/word-to-pdf',
          supportsQuality: true,
          category: 'convert',
        },
      ];

    case 'excel':
      return [
        {
          id: 'excel-to-pdf',
          label: 'Excel to PDF (.pdf)',
          description: 'Convert Excel spreadsheets into a print-ready formatted PDF document.',
          outputFormat: 'PDF',
          outputExtension: 'pdf',
          outputMimeType: 'application/pdf',
          targetRoute: '/tools/excel-to-pdf',
          supportsQuality: true,
          category: 'convert',
        },
      ];

    case 'powerpoint':
      return [
        {
          id: 'powerpoint-to-pdf',
          label: 'PowerPoint to PDF (.pdf)',
          description: 'Convert presentation slides into high-resolution PDF pages.',
          outputFormat: 'PDF',
          outputExtension: 'pdf',
          outputMimeType: 'application/pdf',
          targetRoute: '/tools/powerpoint-to-pdf',
          supportsQuality: true,
          category: 'convert',
        },
      ];

    case 'image':
      return [
        {
          id: 'image-to-pdf',
          label: 'Image to PDF (.pdf)',
          description: 'Convert photo files into a standardized, high-quality PDF document.',
          outputFormat: 'PDF',
          outputExtension: 'pdf',
          outputMimeType: 'application/pdf',
          targetRoute: '/tools/jpg-to-pdf',
          supportsQuality: true,
          category: 'convert',
        },
      ];

    default:
      return [];
  }
}
