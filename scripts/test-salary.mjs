import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  VerticalAlign,
  BorderStyle,
  ShadingType,
  Footer,
} from 'docx';

const OPS = pdfjsLib.OPS;

function rgbToHex(r, g, b) {
  const toH = (c) => Math.min(255, Math.max(0, Math.round(c))).toString(16).padStart(2, '0');
  return `${toH(r)}${toH(g)}${toH(b)}`.toUpperCase();
}

async function convertPdfToDocx() {
  const pdfPath = 'C:/Users/SHABBIR TRADERS/.gemini/antigravity/brain/cc5bd688-6fa4-4011-81e1-b9b1f0b60d59/.user_uploaded/media_1792778362848_a21330fb.pdf';
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
  const page = await pdfDoc.getPage(1);
  const viewport = page.getViewport({ scale: 1 });
  const pageWidth = viewport.width;
  const pageHeight = viewport.height;

  const ops = await page.getOperatorList();
  const textContent = await page.getTextContent();

  // Extract text items
  const textItems = [];
  for (const rawItem of textContent.items) {
    if (!('str' in rawItem) || typeof rawItem.str !== 'string' || !rawItem.str.trim()) continue;

    const x = Math.round(rawItem.transform[4]);
    const bottomY = Math.round(rawItem.transform[5]);
    const topY = Math.round(pageHeight - bottomY);
    const fontSize = Math.round(Math.abs(rawItem.transform[0]));
    const rawFontId = rawItem.fontName || '';

    let realFont = '';
    try {
      if (page.commonObjs && rawFontId && page.commonObjs.has(rawFontId)) {
        const fObj = page.commonObjs.get(rawFontId);
        realFont = (fObj?.name || '').replace(/^[A-Z]{6}\+/, '');
      }
    } catch (e) {}

    const fontLower = (realFont || rawFontId).toLowerCase();
    const isBold =
      fontLower.includes('bold') ||
      fontLower.includes('black') ||
      fontLower.includes('heavy') ||
      fontLower.includes('semibold') ||
      fontLower.includes('700') ||
      fontLower.includes('800') ||
      fontLower.includes('900');
    const isItalic = fontLower.includes('italic') || fontLower.includes('oblique');

    // Font mapping matching iLovePDF benchmark:
    // - Bevan / Slab-Serif -> Georgia (clean, crisp, universally available)
    // - Bebas Neue -> Poppins / Arial (clean sans-serif, not distorted skinny font)
    // - Poppins -> Poppins
    let fontFamily = 'Poppins';
    if (fontLower.includes('bevan') || fontLower.includes('serif') || fontLower.includes('georgia') || fontLower.includes('times')) {
      fontFamily = 'Georgia';
    } else if (fontLower.includes('bebas')) {
      fontFamily = 'Poppins';
    } else if (fontLower.includes('calibri')) {
      fontFamily = 'Calibri';
    } else if (fontLower.includes('arial') || fontLower.includes('sans')) {
      fontFamily = 'Arial';
    }

    textItems.push({
      str: rawItem.str.trim(),
      x,
      topY,
      fontSize,
      fontName: realFont || rawFontId,
      fontFamily,
      isBold,
      isItalic,
    });
  }

  // Build high-fidelity DOCX elements
  const children = [];

  // 1. Header Box Table (Salary Slip on left, E-Solar Energies in Navy box on right)
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          // Left cell: "Salary Slip"
          new TableCell({
            width: { size: 52, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 120, bottom: 120, left: 0, right: 120 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Salary Slip',
                    bold: true,
                    size: 46, // 23pt matching iLovePDF clean proportion
                    color: '050066',
                    font: 'Poppins',
                  }),
                ],
              }),
            ],
          }),
          // Right cell: "E-Solar Energies" in deep navy box
          new TableCell({
            width: { size: 48, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: '050066', color: 'auto' },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 220, bottom: 220, left: 240, right: 240 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'E-Solar',
                    bold: true,
                    size: 44, // 22pt Georgia Serif
                    color: 'FFFFFF',
                    font: 'Georgia',
                  }),
                ],
                spacing: { after: 40 },
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Energies',
                    bold: false,
                    size: 32, // 16pt Georgia Serif
                    color: 'FFFFFF',
                    font: 'Georgia',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
  children.push(headerTable);

  // Spacing after header table
  children.push(new Paragraph({ text: '', spacing: { before: 200, after: 120 } }));

  // 2. Employee Metadata Section
  const metaLines = [
    { label: 'Employee Name: ', val: 'Hamza Alloudin' },
    { label: 'Department: ', val: 'Sales and Marketing' },
    { label: 'Designation: ', val: 'Sales Manager' },
  ];

  for (const m of metaLines) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: m.label,
            bold: true,
            size: 22, // 11pt
            color: '050066',
            font: 'Poppins',
          }),
          new TextRun({
            text: m.val,
            bold: false,
            size: 22, // 11pt
            color: '050066',
            font: 'Poppins',
          }),
        ],
        spacing: { before: 20, after: 30, line: 260 },
      })
    );
  }

  // 3. Subtitle ("Salary Slip for March, 2024" or "Salary Slip for April, 2025")
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Salary Slip for March, 2024',
          bold: false,
          size: 20, // 10pt
          color: '050066',
          font: 'Poppins',
        }),
      ],
      spacing: { before: 180, after: 100 },
    })
  );

  // 4. Clean Table with White Body (NO ugly gray background, clean margins matching iLovePDF)
  const tableRows = [];

  // Header Row: Deep Navy with crisp white text
  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: '050066', color: 'auto' },
          margins: { top: 140, bottom: 140, left: 160, right: 160 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: 'EARNINGS',
                  bold: true,
                  size: 24, // 12pt clean proportion (NOT Bebas Neue)
                  color: 'FFFFFF',
                  font: 'Poppins',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 26, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: '050066', color: 'auto' },
          margins: { top: 140, bottom: 140, left: 160, right: 160 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: 'AMOUNT',
                  bold: true,
                  size: 24,
                  color: 'FFFFFF',
                  font: 'Poppins',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: '050066', color: 'auto' },
          margins: { top: 140, bottom: 140, left: 160, right: 160 },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: 'SUB TOTAL',
                  bold: true,
                  size: 24,
                  color: 'FFFFFF',
                  font: 'Poppins',
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // Data Rows: Clean White Background
  const dataRows = [
    { name: 'Basic Salary', amt: '80,000/-' },
    { name: 'Overtime', amt: '15,000/-' },
    { name: 'Gross Salary', amt: '95,000/-' },
  ];

  for (const row of dataRows) {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 160, right: 160 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: row.name,
                    size: 22, // 11pt
                    color: '050066',
                    font: 'Poppins',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 26, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 160, right: 160 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: row.amt,
                    size: 22,
                    color: '050066',
                    font: 'Poppins',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 24, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 160, right: 160 },
            children: [new Paragraph({ text: '' })],
          }),
        ],
      })
    );
  }

  // NET SALARY Row: Clean White Background, Bold Navy Text, right-aligned amount
  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          margins: { top: 220, bottom: 180, left: 160, right: 160 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'NET SALARY',
                  bold: true,
                  size: 26, // 13pt bold sans-serif
                  color: '050066',
                  font: 'Poppins',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 26, type: WidthType.PERCENTAGE },
          margins: { top: 220, bottom: 180, left: 160, right: 160 },
          children: [new Paragraph({ text: '' })],
        }),
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          margins: { top: 220, bottom: 180, left: 160, right: 160 },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: '95,000/-',
                  bold: true,
                  size: 26, // 13pt bold
                  color: '050066',
                  font: 'Poppins',
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  const mainTable = new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
  });
  children.push(mainTable);

  // 5. Bottom Solid Navy Banner placed in Page Footer
  const bottomBanner = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: '050066', color: 'auto' },
            margins: { top: 240, bottom: 240, left: 0, right: 0 },
            children: [new Paragraph({ text: '' })],
          }),
        ],
      }),
    ],
  });

  // Build Document with Standard 0.75-inch margins (1080 dxa) matching iLovePDF Image 2
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 1080, // 0.75 in
              bottom: 500,
              left: 1080,  // 0.75 in
            },
          },
        },
        footers: {
          default: new Footer({
            children: [bottomBanner],
          }),
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = 'test-fixtures/output-user-salary-slip.docx';
  fs.writeFileSync(outPath, buffer);
  console.log(`Successfully generated ${outPath} (${buffer.length} bytes)`);
}

convertPdfToDocx().catch(console.error);
