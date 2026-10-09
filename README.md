# Premium PDF Tools Hub

A production-ready, privacy-first PDF tools suite built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**.

All 26 PDF processing tools operate **100% client-side** inside the user's web browser using WebAssembly. Zero files are ever uploaded or transmitted to any remote server.

## Features & Highlights

- **26 Client-Side PDF Tools:**
  - **Tier 1 (Highest Priority):** Merge PDF, Compress PDF, PDF to Word, PDF to JPG, JPG to PDF, Split PDF, Word to PDF
  - **Tier 2:** PDF to PNG, PNG to PDF, Excel to PDF, PDF to Excel, Rotate PDF, Extract PDF Pages, Delete PDF Pages, PowerPoint to PDF, PDF to PowerPoint
  - **Tier 3:** Add Watermark, Password Protect, Unlock PDF, Sign PDF Online, View Metadata, Remove Metadata, Reorder Pages, Thumbnail Generator, PDF Preview, Fill PDF Forms
- **100% Client-Side Architecture:** Zero server-side file processing, zero file uploads, zero cloud storage.
- **Organic SEO Engine:**
  - Automated `sitemap.xml` and `robots.txt`
  - Per-page `generateMetadata` with custom titles, descriptions, canonical links, OpenGraph, and Twitter Cards
  - Rich JSON-LD Structured Data: `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, `Article`, `WebSite`, and `Organization` schemas
- **High-Converting Design System:**
  - Clean Inter typography, professional blue/slate brand palette, purposeful whitespace
  - Sticky navbar with desktop mega-menu and mobile slide-out drawer
  - Zero placeholder ads or fake ad divs (clean for Google AdSense approval)
- **15 In-Depth MDX Blog Guides:** Genuinely helpful, 500–1200 word tutorials with internal tool linking.
- **Legal & Trust Pages:** Comprehensive About Us, Contact, Privacy Policy, Terms & Conditions, and Disclaimer pages.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS 4
- **PDF Engines:**
  - `pdf-lib` (merge, split, compress, rotate, extract, delete, watermark, protect, metadata, organize, forms, sign)
  - `pdfjs-dist` (canvas rendering, preview, thumbnails, text extraction)
  - `jsPDF` (image/word/excel/presentation rendering)
  - `docx` & `mammoth` (Word document conversions)
  - `xlsx` (Excel spreadsheet table processing)
  - `pptxgenjs` (PowerPoint generation)
  - `file-saver` (local client-side downloads)

## Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
