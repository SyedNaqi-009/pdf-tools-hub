const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel } = require('docx');

const FIXTURES_DIR = path.join(__dirname, '..', 'test-fixtures');

if (!fs.existsSync(FIXTURES_DIR)) {
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });
}

async function generateRichPdf() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await doc.embedFont(StandardFonts.HelveticaOblique);

  // Page 1: Headings and Formatted Paragraphs
  const page1 = doc.addPage([595.28, 841.89]);
  let y = 780;

  page1.drawText('dopdf Engineering Test Document', {
    x: 50,
    y,
    size: 22,
    font: boldFont,
    color: rgb(0.08, 0.12, 0.2),
  });
  y -= 30;

  page1.drawText('High-Fidelity Document Architecture & Benchmark Suite', {
    x: 50,
    y,
    size: 13,
    font: italicFont,
    color: rgb(0.3, 0.35, 0.45),
  });
  y -= 40;

  page1.drawText('1. Executive Overview and Structural Integrity', {
    x: 50,
    y,
    size: 14,
    font: boldFont,
    color: rgb(0.12, 0.25, 0.6),
  });
  y -= 25;

  const p1 = 'This document is a synthetic test fixture generated to evaluate text extraction, styling hierarchy, and vector layout fidelity in client-side document conversions. dopdf preserves bold, italic, and hierarchical typography across transitions into Microsoft Word OpenXML (.docx) and spreadsheets.';
  page1.drawText(p1.slice(0, 85), { x: 50, y, size: 10, font, color: rgb(0.15, 0.15, 0.15) });
  y -= 16;
  page1.drawText(p1.slice(85, 175), { x: 50, y, size: 10, font, color: rgb(0.15, 0.15, 0.15) });
  y -= 16;
  page1.drawText(p1.slice(175), { x: 50, y, size: 10, font, color: rgb(0.15, 0.15, 0.15) });
  y -= 35;

  page1.drawText('• Point Alpha: Client-side in-memory zero data retention guarantee.', { x: 65, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
  y -= 18;
  page1.drawText('• Point Beta: High-efficiency object stream compression & downscaling.', { x: 65, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
  y -= 18;
  page1.drawText('• Point Gamma: Full RTL and Unicode typography rendering via browser engines.', { x: 65, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });

  const bytes = await doc.save();
  fs.writeFileSync(path.join(FIXTURES_DIR, 'test-rich-formatting.pdf'), bytes);
  console.log(`Generated test-rich-formatting.pdf (${bytes.length} bytes)`);
}

async function generateTablesPdf() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const page = doc.addPage([595.28, 841.89]);
  let y = 780;

  page.drawText('Financial Performance & Data Matrix (2025-2026)', {
    x: 50,
    y,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.15, 0.3),
  });
  y -= 35;

  const rows = [
    ['Metric ID', 'Fiscal Quarter', 'Gross Revenue', 'Operating Margin', 'Status'],
    ['MTR-001', 'Q1 2025', '$ 1,250,400.50', '28.4%', 'Verified'],
    ['MTR-002', 'Q2 2025', '$ 1,480,920.00', '31.2%', 'Verified'],
    ['MTR-003', 'Q3 2025', '$ 1,620,110.75', '29.8%', 'Audited'],
    ['MTR-004', 'Q4 2025', '$ 2,105,330.20', '34.5%', 'Final'],
    ['MTR-005', 'Q1 2026', '$ 2,450,000.00', '36.1%', 'Projected'],
  ];

  const colWidths = [80, 100, 120, 100, 80];

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const isHeader = r === 0;
    const currentFont = isHeader ? boldFont : font;

    page.drawRectangle({
      x: 50,
      y: y - 5,
      width: 480,
      height: 22,
      color: isHeader ? rgb(0.9, 0.94, 1.0) : r % 2 === 0 ? rgb(0.98, 0.98, 0.98) : rgb(1, 1, 1),
    });

    let currentX = 55;
    for (let c = 0; c < row.length; c++) {
      page.drawText(row[c], {
        x: currentX,
        y: y,
        size: 9,
        font: currentFont,
        color: isHeader ? rgb(0.1, 0.25, 0.6) : rgb(0.15, 0.15, 0.15),
      });
      currentX += colWidths[c];
    }
    y -= 24;
  }

  const bytes = await doc.save();
  fs.writeFileSync(path.join(FIXTURES_DIR, 'test-tables.pdf'), bytes);
  console.log(`Generated test-tables.pdf (${bytes.length} bytes)`);
}

async function generateRichDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'dopdf Word Conversion Fidelity Specification',
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'This document tests conversion from DOCX to PDF preserving headings, styling, tables, and paragraphs.',
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: 'Technical Execution Requirements',
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'All conversion routines run entirely in client-side memory without transmitting unencrypted data to remote servers. ',
              }),
              new TextRun({
                text: 'High-speed WebAssembly parsing ensures zero cloud latency.',
                bold: true,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Tool Name', style: 'strong' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Target Output', style: 'strong' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Client Sandbox', style: 'strong' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'PDF to Word' })] }),
                  new TableCell({ children: [new Paragraph({ text: '.docx OpenXML' })] }),
                  new TableCell({ children: [new Paragraph({ text: '100% In-Memory' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'PDF to Excel' })] }),
                  new TableCell({ children: [new Paragraph({ text: '.xlsx Spreadsheet' })] }),
                  new TableCell({ children: [new Paragraph({ text: '100% In-Memory' })] }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(FIXTURES_DIR, 'test-rich-formatting.docx'), buffer);
  console.log(`Generated test-rich-formatting.docx (${buffer.length} bytes)`);
}

async function run() {
  console.log('Generating synthetic test fixtures...');
  await generateRichPdf();
  await generateTablesPdf();
  await generateRichDocx();
  console.log('All synthetic fixtures generated in test-fixtures/.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
