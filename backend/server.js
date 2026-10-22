const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PDFDocument, degrees, rgb, StandardFonts } = require('pdf-lib');

const app = express();
const PORT = process.env.PORT || 8080;

// Multer memory storage (keeps files in RAM, zero disk residue for maximum confidentiality)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file
  },
});

// Allowed origins
const allowedOrigins = [
  'https://www.dopdfconverter.online',
  'https://dopdfconverter.online',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during transition/testing
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// 1. Healthcheck endpoint for Railway / load balancers
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'dopdf-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'dopdf server-side PDF processing microservice is active.',
    healthcheck: '/health',
  });
});

// 2. Server-Side Merge PDF
app.post('/api/pdf/merge', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'Please upload at least two PDF documents to merge.' });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="merged-document.pdf"');
    return res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Merge Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to merge PDF files.' });
  }
});

// 3. Server-Side Compress PDF
app.post('/api/pdf/compress', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF document to compress.' });
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    
    // Strip redundant metadata and object dictionaries
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('dopdf');
    pdfDoc.setCreator('dopdf');

    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="compressed-${req.file.originalname}"`);
    return res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Compress Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to compress PDF file.' });
  }
});

// 4. Server-Side Rotate PDF
app.post('/api/pdf/rotate', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF document to rotate.' });
    }

    const angle = parseInt(req.body.angle, 10) || 90;
    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + angle) % 360));
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="rotated-${req.file.originalname}"`);
    return res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Rotate Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to rotate PDF.' });
  }
});

// 5. Server-Side Watermark PDF
app.post('/api/pdf/watermark', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF document.' });
    }

    const watermarkText = req.body.text || 'CONFIDENTIAL';
    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();
      const fontSize = 42;
      const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      page.drawText(watermarkText, {
        x: width / 2 - textWidth / 2,
        y: height / 2 - textHeight / 2,
        size: fontSize,
        font: font,
        color: rgb(0.85, 0.1, 0.2),
        opacity: 0.25,
        rotate: degrees(45),
      });
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="watermarked-${req.file.originalname}"`);
    return res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Watermark Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to apply watermark.' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }
  res.status(500).json({ error: err.message || 'Internal server error occurred.' });
});

// Start HTTP Server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`dopdf backend service running on port ${PORT}`);
});

// Graceful termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});
