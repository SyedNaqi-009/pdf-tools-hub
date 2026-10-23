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

  // 1. Operator list MUST be fetched first to resolve commonObjs font dictionary
  const ops = await page.getOperatorList();
  const textContent = await page.getTextContent();

  // Extract rects with accurate top-down Y
  const rects = [];
  let curFill = '000000';
  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i];
    const args = ops.argsArray[i];
    if (fn === OPS.setFillRGBColor) {
      curFill = rgbToHex(args[0], args[1], args[2]);
    } else if (fn === OPS.constructPath) {
      const pData = args[1];
      if (pData && pData.length >= 4) {
        const x = Math.round(pData[0]);
        const y = Math.round(pData[1]);
        const w = Math.round(pData[2]);
        const h = Math.round(pData[3]);
        if (w > 10 && h > 10 && curFill !== 'FFFFFF') {
          rects.push({ x, y, width: w, height: h, color: curFill });
        }
      }
    }
  }

  console.log('Filtered rects:', rects);

  // Extract text items with top-down Y
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

    let fontFamily = 'Arial';
    if (fontLower.includes('poppins')) fontFamily = 'Poppins';
    else if (fontLower.includes('bebas')) fontFamily = 'Bebas Neue';
    else if (fontLower.includes('bevan')) fontFamily = 'Bevan';
    else if (fontLower.includes('georgia')) fontFamily = 'Georgia';
    else if (fontLower.includes('times')) fontFamily = 'Times New Roman';
    else if (fontLower.includes('calibri')) fontFamily = 'Calibri';
    else if (fontLower.includes('roboto')) fontFamily = 'Roboto';
    else if (fontLower.includes('sans')) fontFamily = 'Arial';
    else if (fontLower.includes('serif')) fontFamily = 'Georgia';

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

  console.log(`Extracted ${textItems.length} text items`);

  // Build high-fidelity DOCX elements
  const children = [];

  // 1. Header Box Table (Salary Slip on left, E-Solar Energies in Navy box on right)
  const headerBoxRect = rects.find((r) => r.y < 200 && r.x > 200 && r.width > 200);
  const salarySlipItem = textItems.find((t) => t.str.toLowerCase().includes('salary slip') && t.topY < 200);
  const eSolarItem = textItems.find((t) => t.str.toLowerCase().includes('e-solar'));
  const energiesItem = textItems.find((t) => t.str.toLowerCase().includes('energies'));

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
            width: { size: 48, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: salarySlipItem ? salarySlipItem.str : 'Salary Slip',
                    bold: true,
                    size: 54, // 27pt matching source
                    color: headerBoxRect ? headerBoxRect.color : '050066',
                    font: 'Poppins',
                  }),
                ],
                spacing: { before: 100, after: 100 },
              }),
            ],
          }),
          // Right cell: Navy Box with "E-Solar" and "Energies"
          new TableCell({
            width: { size: 52, type: WidthType.PERCENTAGE },
            shading: {
              type: ShadingType.CLEAR,
              fill: headerBoxRect ? headerBoxRect.color : '050066',
              color: 'auto',
            },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 200, bottom: 200, left: 240, right: 240 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: eSolarItem ? eSolarItem.str : 'E-Solar',
                    size: 68, // 34pt Bevan
                    color: 'FFFFFF',
                    font: 'Bevan',
                  }),
                ],
                spacing: { before: 40, after: 40 },
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: energiesItem ? energiesItem.str : 'Energies',
                    size: 48, // 24pt Bevan
                    color: 'FFFFFF',
                    font: 'Bevan',
                  }),
                ],
                spacing: { before: 0, after: 40 },
              }),
            ],
          }),
        ],
      }),
    ],
  });
  children.push(headerTable);

  // Spacing below header
  children.push(new Paragraph({ text: '', spacing: { before: 180, after: 180 } }));

  // 2. Employee Info Section
  const empNameLabel = textItems.find((t) => t.str.toLowerCase().startsWith('employee name'));
  const empNameVal = textItems.find((t) => t.str.toLowerCase().includes('hamza'));
  const deptLabel = textItems.find((t) => t.str.toLowerCase().startsWith('department'));
  const deptVal = textItems.find((t) => t.str.toLowerCase().includes('sales and marketing'));
  const desigLabel = textItems.find((t) => t.str.toLowerCase().startsWith('designation'));
  const desigVal = textItems.find((t) => t.str.toLowerCase().includes('sales manager'));

  const makeMetaRow = (label, val) =>
    new Paragraph({
      spacing: { before: 30, after: 30, line: 260 },
      children: [
        new TextRun({
          text: label ? (label.endsWith(':') ? label + ' ' : label + ': ') : '',
          bold: true,
          size: 24, // 12pt matching iLovePDF compact rendering
          color: '050066',
          font: 'Poppins',
        }),
        new TextRun({
          text: val || '',
          bold: false,
          size: 24,
          color: '050066',
          font: 'Poppins',
        }),
      ],
    });

  children.push(makeMetaRow('Employee Name:', empNameVal ? empNameVal.str : 'Hamza Alloudin'));
  children.push(makeMetaRow('Department:', deptVal ? deptVal.str.replace(/^:\s*/, '') : 'Sales and Marketing'));
  children.push(makeMetaRow('Designation:', desigVal ? desigVal.str : 'Sales Manager'));

  // 3. Subtitle: "Salary Slip for April, 2025"
  const subTitleItem = textItems.find((t) => t.str.toLowerCase().includes('salary slip for'));
  children.push(
    new Paragraph({
      spacing: { before: 240, after: 80 },
      children: [
        new TextRun({
          text: subTitleItem ? subTitleItem.str : 'Salary Slip for April, 2025',
          size: 22, // 11pt
          color: '050066',
          font: 'Poppins',
        }),
      ],
    })
  );

  // 4. Data Table (Headers: EARNINGS, AMOUNT, SUB TOTAL; Body: Basic Salary, Overtime, Gross Salary, NET SALARY)
  const tableHeaderRect = rects.find((r) => r.y > 300 && r.y < 400 && r.color === '050066');
  const tableCardRect = rects.find((r) => r.y > 350 && r.color === 'F6F6F6');

  const tableRows = [];

  // Table Header Row: Deep Navy with Bebas Neue uppercase headers
  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: '050066', color: 'auto' },
          margins: { top: 160, bottom: 160, left: 200, right: 180 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'EARNINGS',
                  bold: true,
                  size: 34, // 17pt Bebas Neue
                  color: 'FFFFFF',
                  font: 'Bebas Neue',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 26, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: '050066', color: 'auto' },
          margins: { top: 160, bottom: 160, left: 180, right: 180 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'AMOUNT',
                  bold: true,
                  size: 34,
                  color: 'FFFFFF',
                  font: 'Bebas Neue',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: '050066', color: 'auto' },
          margins: { top: 160, bottom: 160, left: 180, right: 200 },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: 'SUB TOTAL',
                  bold: true,
                  size: 34,
                  color: 'FFFFFF',
                  font: 'Bebas Neue',
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // Table Body Rows: Clean soft gray (#F6F6F6) background, NO borders
  const bodyData = [
    { name: 'Basic Salary', amt: '80,000/-' },
    { name: 'Overtime', amt: '15,000/-' },
    { name: 'Gross Salary', amt: '95,000/-' },
  ];

  for (const row of bodyData) {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'F6F6F6', color: 'auto' },
            margins: { top: 100, bottom: 100, left: 200, right: 180 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: row.name,
                    size: 23, // 11.5pt Poppins
                    color: '050066',
                    font: 'Poppins',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 26, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'F6F6F6', color: 'auto' },
            margins: { top: 100, bottom: 100, left: 180, right: 180 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: row.amt,
                    size: 23,
                    color: '050066',
                    font: 'Poppins',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 24, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'F6F6F6', color: 'auto' },
            margins: { top: 100, bottom: 100, left: 180, right: 200 },
            children: [new Paragraph({ text: '' })],
          }),
        ],
      })
    );
  }

  // NET SALARY Row: Bebas Neue for "NET SALARY", Poppins-Medium for amount, right aligned under SUB TOTAL
  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'F6F6F6', color: 'auto' },
          margins: { top: 280, bottom: 240, left: 200, right: 180 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'NET SALARY',
                  bold: true,
                  size: 34, // 17pt Bebas Neue
                  color: '050066',
                  font: 'Bebas Neue',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 26, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'F6F6F6', color: 'auto' },
          margins: { top: 280, bottom: 240, left: 180, right: 180 },
          children: [new Paragraph({ text: '' })],
        }),
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'F6F6F6', color: 'auto' },
          margins: { top: 280, bottom: 240, left: 180, right: 200 },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: '95,000/-',
                  bold: true,
                  size: 34, // 17pt Bebas Neue/Poppins
                  color: '050066',
                  font: 'Bebas Neue',
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

  // 5. Spacing and Bottom Navy Banner
  children.push(new Paragraph({ text: '', spacing: { before: 320, after: 320 } }));

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
            margins: { top: 300, bottom: 300, left: 100, right: 100 },
            children: [new Paragraph({ text: '' })],
          }),
        ],
      }),
    ],
  });
  children.push(bottomBanner);

  // Build Document with custom page margins matching PDF (540 dxa = 0.375 inch)
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 540,
              right: 540,
              bottom: 200,
              left: 540,
            },
          },
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
