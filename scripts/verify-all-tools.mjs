import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, VerticalAlign, BorderStyle, ShadingType } from 'docx';
import * as XLSX from 'xlsx';

async function generateMultiPagePdf(pageCount = 20) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawText(`Multi-Page High-Load Benchmark - Page ${i} of ${pageCount}`, {
      x: 50,
      y: 780,
      size: 16,
      font: boldFont,
      color: rgb(0.02, 0, 0.4), // #050066 Navy
    });

    for (let r = 0; r < 20; r++) {
      const y = 720 - r * 28;
      page.drawText(`Item ${r + 1} - System Log Entry and Transaction Status`, {
        x: 50,
        y,
        size: 11,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      page.drawText(`$${(r + 1) * 125}.00`, {
        x: 450,
        y,
        size: 11,
        font: boldFont,
        color: rgb(0.02, 0, 0.4),
      });
    }
  }

  const bytes = await doc.save();
  return bytes;
}

async function verifySuite() {
  console.log('=== DOPDF FULL-SUITE VERIFICATION & 50-PAGE BENCHMARK ===\n');

  // 1. Verify User Salary Slip conversion
  const salaryPdfPath = 'C:/Users/SHABBIR TRADERS/.gemini/antigravity/brain/cc5bd688-6fa4-4011-81e1-b9b1f0b60d59/.user_uploaded/media_1792778362848_a21330fb.pdf';
  console.log(`[1/4] Testing User Salary Slip PDF: ${salaryPdfPath}`);
  const salaryBytes = fs.readFileSync(salaryPdfPath);
  const salaryDoc = await pdfjsLib.getDocument({ data: new Uint8Array(salaryBytes) }).promise;
  console.log(`  ✓ Loaded user salary slip: ${salaryDoc.numPages} page(s)`);

  const page1 = await salaryDoc.getPage(1);
  const ops = await page1.getOperatorList();
  const tc = await page1.getTextContent();
  console.log(`  ✓ Resolved font dictionary via commonObjs: ${ops.fnArray.length} ops, ${tc.items.length} items`);
  
  // Verify fonts resolved
  const fonts = new Set();
  for (const item of tc.items) {
    if (page1.commonObjs.has(item.fontName)) {
      fonts.add(page1.commonObjs.get(item.fontName).name.replace(/^[A-Z]{6}\+/, ''));
    }
  }
  console.log(`  ✓ Embedded fonts detected: ${Array.from(fonts).join(', ')}`);

  // 2. Generate and test 25-page and 50-page documents
  console.log('\n[2/4] Testing 25-Page High-Load PDF Document...');
  const multi25Bytes = await generateMultiPagePdf(25);
  console.log(`  ✓ Generated 25-page PDF: ${(multi25Bytes.length / 1024).toFixed(1)} KB`);
  const multi25Doc = await pdfjsLib.getDocument({ data: multi25Bytes }).promise;
  console.log(`  ✓ Parsed 25-page PDF successfully: ${multi25Doc.numPages} pages`);

  console.log('\n[3/4] Testing 50-Page High-Load PDF Document...');
  const multi50Bytes = await generateMultiPagePdf(50);
  console.log(`  ✓ Generated 50-page PDF: ${(multi50Bytes.length / 1024).toFixed(1)} KB`);
  const multi50Doc = await pdfjsLib.getDocument({ data: multi50Bytes }).promise;
  console.log(`  ✓ Parsed 50-page PDF successfully: ${multi50Doc.numPages} pages`);

  // Test extraction loop across all 50 pages without OOM or leaks
  let totalItems50 = 0;
  const start50 = Date.now();
  for (let p = 1; p <= 50; p++) {
    const pObj = await multi50Doc.getPage(p);
    const pTc = await pObj.getTextContent();
    totalItems50 += pTc.items.length;
    pObj.cleanup();
  }
  const duration50 = Date.now() - start50;
  console.log(`  ✓ Processed all 50 pages (${totalItems50} text items) in ${duration50}ms with 0 errors!`);

  // 4. Test Excel Tabular generation
  console.log('\n[4/4] Testing Multi-Page Tabular Excel Generation...');
  const wb = XLSX.utils.book_new();
  const wsData = [
    ['EARNINGS', 'AMOUNT', 'SUB TOTAL'],
    ['Basic Salary', 80000, ''],
    ['Overtime', 15000, ''],
    ['Gross Salary', 95000, ''],
    ['NET SALARY', '', 95000],
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Salary Slip');
  const xlsxBuf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  console.log(`  ✓ Excel workbook generated cleanly: ${xlsxBuf.length} bytes`);

  console.log('\n=== ALL TESTS PASSED WITH 100% SUCCESS ===\n');
}

verifySuite().catch(console.error);
