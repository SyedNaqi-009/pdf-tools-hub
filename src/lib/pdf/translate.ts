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
 * Timeout-guarded text translation request (will NEVER hang indefinitely)
 */
async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Robust Multi-Provider Translation Chunk Handler with Strict Timeout
 */
async function translateTextChunk(text: string, targetLang: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  // 1. Primary: Google Translate single-element API with 8s timeout
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
      targetLang
    )}&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetchWithTimeout(url, 7000);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0]
          .map((item: unknown[]) => (item && item[0] ? item[0] : ''))
          .join('');
        if (translated) return translated;
      }
    }
  } catch {
    // Proceed to secondary fallback
  }

  // 2. Secondary: MyMemory API with 8s timeout
  try {
    const fallbackUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      trimmed.slice(0, 500)
    )}&langpair=autodetect|${encodeURIComponent(targetLang)}`;
    const res2 = await fetchWithTimeout(fallbackUrl, 7000);
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2?.responseData?.translatedText) {
        return data2.responseData.translatedText;
      }
    }
  } catch {
    // Proceed to tertiary fallback
  }

  // 3. If remote providers fail or timeout, return original text rather than hanging or crashing
  return trimmed;
}

/**
 * Timeout-safe PDF Document Translation
 */
export async function translatePdf(
  file: File,
  targetLang: string = 'es',
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.(5, 'Initializing PDF text extractor & translation pipeline...');
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const fileBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  onProgress?.(15, `Extracting textual paragraphs from ${numPages} page(s)...`);
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

    const translatedParagraphs: string[] = [];
    for (let pIdx = 0; pIdx < pageParagraphs.length; pIdx++) {
      const paragraph = pageParagraphs[pIdx];
      const prog = Math.round(15 + ((pageNum - 1 + (pIdx + 1) / pageParagraphs.length) / numPages) * 65);
      onProgress?.(prog, `Translating page ${pageNum} (${pIdx + 1}/${pageParagraphs.length})...`);

      if (paragraph.length > 1200) {
        const subChunks = paragraph.match(/.{1,900}(\s|$)/g) || [paragraph];
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

  onProgress?.(85, 'Assembling translated PDF layout...');
  const newPdf = await PDFDocument.create();

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);
  const langName = langObj ? langObj.name : targetLang.toUpperCase();
  const isRtl = ['ur', 'ar', 'fa', 'he'].includes(targetLang);

  // In browser environment: Render pages onto high-DPI canvas to support ANY Unicode script (Urdu, Arabic, Hindi, CJK, etc.)
  // without StandardFonts.Helvetica WinAnsi encoding crashes.
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const scale = 2; // 2x DPI for crisp text
    const canvasWidth = Math.round(595.28 * scale);
    const canvasHeight = Math.round(841.89 * scale);
    const padX = Math.round(48 * scale);
    const padTop = Math.round(52 * scale);
    const padBottom = Math.round(48 * scale);
    const maxContentWidth = canvasWidth - padX * 2;
    const fontSize = Math.round(11 * scale);
    const lineHeight = Math.round(18 * scale);

    for (let i = 0; i < translatedPagesText.length; i++) {
      const paragraphs = translatedPagesText[i];
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      // Pure white paper background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Header top bar
      ctx.fillStyle = '#2563eb'; // blue accent
      ctx.font = `bold ${Math.round(11 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Noto Nastaliq Urdu", sans-serif`;
      ctx.textAlign = 'left';
      ctx.direction = 'ltr';
      ctx.fillText(`dopdf · Translated Document (${langName})`, padX, padTop - Math.round(20 * scale));

      ctx.fillStyle = '#71717a';
      ctx.font = `${Math.round(10 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText(`Page ${i + 1} of ${translatedPagesText.length}`, canvasWidth - padX, padTop - Math.round(20 * scale));

      // Divider line
      ctx.strokeStyle = '#e4e4e7';
      ctx.lineWidth = Math.round(1 * scale);
      ctx.beginPath();
      ctx.moveTo(padX, padTop - Math.round(10 * scale));
      ctx.lineTo(canvasWidth - padX, padTop - Math.round(10 * scale));
      ctx.stroke();

      // Content rendering with RTL and complex typography support
      ctx.fillStyle = '#18181b';
      ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Noto Nastaliq Urdu", "Arial Unicode MS", sans-serif`;
      ctx.textAlign = isRtl ? 'right' : 'left';
      ctx.direction = isRtl ? 'rtl' : 'ltr';

      let currentY = padTop + Math.round(16 * scale);
      const textX = isRtl ? canvasWidth - padX : padX;

      for (const para of paragraphs) {
        if (currentY > canvasHeight - padBottom) break;

        const words = para.split(/\s+/);
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxContentWidth && currentLine) {
            ctx.fillText(currentLine, textX, currentY);
            currentY += lineHeight;
            currentLine = word;
            if (currentY > canvasHeight - padBottom) break;
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine && currentY <= canvasHeight - padBottom) {
          ctx.fillText(currentLine, textX, currentY);
          currentY += Math.round(lineHeight * 1.4); // Paragraph spacing
        }
      }

      // Convert canvas to image and embed into PDF
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const base64Data = dataUrl.split(',')[1];
      const binaryStr = atob(base64Data);
      const bytes = new Uint8Array(binaryStr.length);
      for (let b = 0; b < binaryStr.length; b++) {
        bytes[b] = binaryStr.charCodeAt(b);
      }

      const embeddedJpg = await newPdf.embedJpg(bytes);
      const pdfPage = newPdf.addPage([595.28, 841.89]);
      pdfPage.drawImage(embeddedJpg, {
        x: 0,
        y: 0,
        width: 595.28,
        height: 841.89,
      });
    }
  } else {
    // Headless / fallback with safe WinAnsi sanitization so it NEVER crashes
    const font = await newPdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await newPdf.embedFont(StandardFonts.HelveticaBold);
    for (let i = 0; i < translatedPagesText.length; i++) {
      const paragraphs = translatedPagesText[i];
      const page = newPdf.addPage([595.28, 841.89]);
      const { height } = page.getSize();
      const margin = 50;
      let y = height - margin;

      page.drawText(`dopdf · Translated Document (${langName})`, {
        x: margin,
        y,
        size: 10,
        font: boldFont,
        color: rgb(0.15, 0.35, 0.9),
      });

      y -= 30;
      for (const para of paragraphs) {
        if (y < margin + 40) break;
        const safePara = para.replace(/[^\x20-\x7E]/g, '?');
        page.drawText(safePara.slice(0, 100), {
          x: margin,
          y,
          size: 10,
          font,
          color: rgb(0.12, 0.16, 0.23),
        });
        y -= 16;
      }
    }
  }

  onProgress?.(100, 'Translated document generated successfully.');
  const pdfBytes = await newPdf.save();
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}
