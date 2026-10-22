import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ProgressCallback } from './merge';

export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'tr', name: 'Turkish (Türkçe)' },
  { code: 'nl', name: 'Dutch (Nederlands)' },
  { code: 'pl', name: 'Polish (Polski)' },
  { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
  { code: 'en', name: 'English' },
  { code: 'sv', name: 'Swedish (Svenska)' },
  { code: 'el', name: 'Greek (Ελληνικά)' },
  { code: 'cs', name: 'Czech (Čeština)' },
  { code: 'ro', name: 'Romanian (Română)' },
  { code: 'th', name: 'Thai (ไทย)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
] as const;

/**
 * Free, reliable text translation chunker
 */
async function translateTextChunk(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim()) return '';

  try {
    // Primary: Google Translate single-element API
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
      targetLang
    )}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        return data[0].map((item: unknown[]) => (item && item[0] ? item[0] : '')).join('');
      }
    }
  } catch {
    // fallback attempt below
  }

  try {
    // Secondary fallback: MyMemory Translation API
    const fallbackUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=autodetect|${encodeURIComponent(targetLang)}`;
    const res2 = await fetch(fallbackUrl);
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2?.responseData?.translatedText) {
        return data2.responseData.translatedText;
      }
    }
  } catch {
    // return original text if translation service unreachable
  }

  return text;
}

/**
 * Translate a PDF document text page-by-page and create a new translated PDF.
 */
export async function translatePdf(
  file: File,
  targetLang: string = 'es',
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(5, 'Initializing PDF parser and language engine...');
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const fileBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  onProgress?.(15, `Extracting and analyzing ${numPages} page(s)...`);

  const translatedPagesText: string[][] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    let pageParagraphs: string[] = [];
    let currentLine = '';

    for (const item of textContent.items) {
      if ('str' in item && typeof item.str === 'string') {
        const str = item.str;
        if (str.trim().length > 0) {
          currentLine += (currentLine ? ' ' : '') + str;
        } else if (currentLine.trim()) {
          pageParagraphs.push(currentLine.trim());
          currentLine = '';
        }
      }
    }
    if (currentLine.trim()) {
      pageParagraphs.push(currentLine.trim());
    }

    if (pageParagraphs.length === 0) {
      pageParagraphs = ['[No readable text detected on this page]'];
    }

    // Translate paragraphs
    const translatedParagraphs: string[] = [];
    for (let pIdx = 0; pIdx < pageParagraphs.length; pIdx++) {
      const paragraph = pageParagraphs[pIdx];
      const prog = Math.round(15 + ((pageNum - 1 + pIdx / pageParagraphs.length) / numPages) * 65);
      onProgress?.(prog, `Translating page ${pageNum} (${pIdx + 1}/${pageParagraphs.length})...`);
      
      if (paragraph.length > 1500) {
        // chunk long paragraphs
        const subChunks = paragraph.match(/.{1,1200}(\s|$)/g) || [paragraph];
        let subRes = '';
        for (const sub of subChunks) {
          subRes += (await translateTextChunk(sub, targetLang)) + ' ';
        }
        translatedParagraphs.push(subRes.trim());
      } else {
        const trans = await translateTextChunk(paragraph, targetLang);
        translatedParagraphs.push(trans);
      }
    }

    translatedPagesText.push(translatedParagraphs);
  }

  onProgress?.(85, 'Assembling translated PDF document...');

  // Create new PDF with pdf-lib
  const newPdf = await PDFDocument.create();
  const font = await newPdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await newPdf.embedFont(StandardFonts.HelveticaBold);

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);
  const langName = langObj ? langObj.name : targetLang.toUpperCase();

  for (let i = 0; i < translatedPagesText.length; i++) {
    const paragraphs = translatedPagesText[i];
    const page = newPdf.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();
    const margin = 50;
    const maxWidth = width - margin * 2;
    let y = height - margin;

    // Header bar
    page.drawText(`dopdf · Translated Document (${langName})`, {
      x: margin,
      y,
      size: 10,
      font: boldFont,
      color: rgb(0.86, 0.15, 0.15), // Crimson
    });

    page.drawText(`Page ${i + 1} of ${translatedPagesText.length}`, {
      x: width - margin - 70,
      y,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    y -= 25;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });
    y -= 20;

    for (const para of paragraphs) {
      if (y < margin + 40) break; // prevent overflowing page

      // Wrap text
      const words = para.split(' ');
      let line = '';
      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, 10);
        if (testWidth > maxWidth) {
          if (y < margin + 20) break;
          // Sanitize characters for standard Helvetica font
          const safeLine = line.replace(/[^\x00-\x7F]/g, '?');
          page.drawText(safeLine, {
            x: margin,
            y,
            size: 10,
            font,
            color: rgb(0.1, 0.1, 0.1),
          });
          y -= 14;
          line = word;
        } else {
          line = testLine;
        }
      }
      if (line && y >= margin + 20) {
        const safeLine = line.replace(/[^\x00-\x7F]/g, '?');
        page.drawText(safeLine, {
          x: margin,
          y,
          size: 10,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
        y -= 22;
      }
    }
  }

  onProgress?.(98, 'Packaging final PDF...');
  const pdfBytes = await newPdf.save();
  onProgress?.(100, 'Translation complete!');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}
