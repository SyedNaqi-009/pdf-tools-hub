export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolItem {
  slug: string;
  name: string;
  tier: 1 | 2 | 3;
  priorityStars: string;
  category: 'core' | 'convert' | 'utility';
  categoryLabel: string;
  actionTitle: string;
  metaDescription: string;
  shortDescription: string;
  intro: string;
  howItWorks: [string, string, string];
  features: [string, string, string, string];
  faqs: ToolFaq[];
  relatedSlugs: string[];
  acceptedFileTypes: string[];
  acceptDescription: string;
  allowMultiple: boolean;
  outputFilename: string;
  outputExtension: string;
  iconName: string;
}

export const TOOLS: ToolItem[] = [
  // --- TIER 1 ---
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    tier: 1,
    priorityStars: '★★★★★',
    category: 'core',
    categoryLabel: 'Core PDF Tools',
    actionTitle: 'Merge PDF Files Online — Combine Multiple PDFs into One Free & Privately',
    metaDescription: 'Combine multiple PDF files into a single unified document directly in your browser. Fast, 100% private, no file uploads, and completely free.',
    shortDescription: 'Combine multiple PDF files into a single unified document in your custom order.',
    intro: 'Merging separate PDF documents into a clean, unified file has never been easier or more private. Whether you are collating monthly financial invoices, submitting multi-part academic papers, or grouping contracts for digital distribution, our browser-powered merge tool accomplishes it instantly. Your files are read and stitched locally on your computer using WebAssembly, ensuring strict data confidentiality with zero server uploads.',
    howItWorks: [
      'Select or drag and drop two or more PDF files into the secure browser dropzone.',
      'Review your files and adjust their ordering as desired for the final consolidated document.',
      'Click "Merge PDF" to instantly combine your documents and download the unified PDF file.'
    ],
    features: [
      '100% client-side assembly keeps sensitive documents strictly private on your device.',
      'Seamless multi-file ordering with instant thumbnail and page count verification.',
      'Preserves original vector sharpness, embedded hyperlinks, bookmarks, and form contents.',
      'Zero file size caps, zero rate limits, and no email registration or account required.'
    ],
    faqs: [
      {
        question: 'Are my uploaded PDF files safe when using this merge tool?',
        answer: 'Yes, completely. Unlike traditional cloud converters, our tool runs entirely inside your web browser. Your PDF documents never leave your device and are never sent to external servers.'
      },
      {
        question: 'Can I change the sequence of pages and documents before merging?',
        answer: 'Yes. You can upload multiple files simultaneously, arrange them in any sequence you choose, and assemble them into a cohesive final document.'
      },
      {
        question: 'Is there a limit on how many PDF files I can merge at once?',
        answer: 'There are no artificial software restrictions. Because the processing occurs within your browser memory, you can merge dozens of documents smoothly depending on your hardware.'
      },
      {
        question: 'Will merging compress or degrade the visual quality of my PDFs?',
        answer: 'Not at all. The underlying PDF vector elements, embedded typefaces, high-resolution imagery, and exact layouts are preserved without lossy re-encoding.'
      },
      {
        question: 'Does this PDF merger work across mobile phones and tablets?',
        answer: 'Yes. The web application is fully responsive and functions reliably on modern mobile browsers across iOS, iPadOS, Android, macOS, Windows, and Linux.'
      }
    ],
    relatedSlugs: ['split-pdf', 'compress-pdf', 'organize-pdf', 'rotate-pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select multiple PDF files (.pdf)',
    allowMultiple: true,
    outputFilename: 'merged-document.pdf',
    outputExtension: 'pdf',
    iconName: 'Layers'
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    tier: 1,
    priorityStars: '★★★★★',
    category: 'core',
    categoryLabel: 'Core PDF Tools',
    actionTitle: 'Compress PDF Files Online — Reduce PDF File Size Without Losing Quality',
    metaDescription: 'Reduce your PDF file size instantly in your browser for seamless email sharing and quick upload speeds without compromising text clarity or layouts.',
    shortDescription: 'Shrink large PDF documents while preserving pristine text sharpness and image fidelity.',
    intro: 'Large PDF documents frequently surpass strict email attachment limits and slow down web portals. Our client-side PDF compressor evaluates your document object trees, strips redundant structural metadata, flattens unused form dictionaries, and optimizes stream allocations directly in your browser. Experience dramatic file size reductions in seconds with absolute privacy and zero server latency.',
    howItWorks: [
      'Drop your heavy PDF file into the dropzone or choose it from your local storage.',
      'Our intelligent optimization engine automatically inspects the document structure and strips redundant data.',
      'Preview the reduced file size and click "Download Compressed PDF" to save your lightweight file.'
    ],
    features: [
      'Intelligent stream de-duplication and metadata pruning for maximum size reduction.',
      'Maintains crisp typographic clarity, high-contrast text lines, and print-ready quality.',
      'Instant client-side processing without uploading proprietary or confidential PDFs.',
      'Ideal for optimizing job resumes, tax filings, legal briefs, and presentation handouts.'
    ],
    faqs: [
      {
        question: 'How does client-side PDF compression work?',
        answer: 'The tool parses the internal object structure of the PDF in your browser memory, removes duplicate fonts, cleans orphan metadata, and re-encodes streams efficiently.'
      },
      {
        question: 'Will text readability or vector logos be blurred by compression?',
        answer: 'No. Vector shapes, vector fonts, and text descriptions are mathematically preserved without pixelation, guaranteeing razor-sharp readability on any display.'
      },
      {
        question: 'Can I compress password-protected PDF documents?',
        answer: 'To compress an encrypted document, first remove the password using our Unlock PDF tool, then compress the unencrypted output.'
      },
      {
        question: 'Is there a file size restriction for compressing PDFs?',
        answer: 'No arbitrary limits are enforced. Even documents of several hundred megabytes can be processed efficiently if your browser has sufficient memory.'
      },
      {
        question: 'Do you keep any copies of my compressed files?',
        answer: 'Never. No file is ever transmitted to a remote server. Everything begins and concludes entirely within your private browser session.'
      }
    ],
    relatedSlugs: ['merge-pdf', 'split-pdf', 'pdf-to-jpg', 'delete-pdf-pages'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF document (.pdf)',
    allowMultiple: false,
    outputFilename: 'compressed-document.pdf',
    outputExtension: 'pdf',
    iconName: 'Minimize2'
  },
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    tier: 1,
    priorityStars: '★★★★★',
    category: 'convert',
    categoryLabel: 'Convert PDF',
    actionTitle: 'Convert PDF to Word Online — Transform PDF to Editable DOCX Free',
    metaDescription: 'Convert PDF documents into fully editable Microsoft Word (.docx) files online. Extract text, formatting, and structural paragraphs directly in browser.',
    shortDescription: 'Convert read-only PDF pages into editable Microsoft Word (.docx) files with ease.',
    intro: 'Extracting text and tables from non-editable PDF files into Microsoft Word often leads to messy formatting and manual retyping. Our dedicated PDF to Word conversion tool parses text runs, font metrics, and paragraph line breaks directly in client-side JavaScript, re-synthesizing them into standard, fully editable .docx documents. Save valuable hours without compromising document confidentiality.',
    howItWorks: [
      'Upload your PDF file using the file selector or drop it directly into the conversion pane.',
      'The client engine extracts structural text runs, lines, and typographic sections from each page.',
      'Click "Download Word Document" to retrieve your editable .docx file instantly.'
    ],
    features: [
      'Generates native OpenXML (.docx) files fully compatible with Microsoft Word, LibreOffice, and Google Docs.',
      'Faithfully captures multi-column paragraphs, bullet points, headers, and document text hierarchy.',
      'High-speed parsing executed locally via WebAssembly and modern browser text APIs.',
      'Guaranteed confidentiality for employment agreements, financial disclosures, and academic dissertations.'
    ],
    faqs: [
      {
        question: 'Can I edit the generated DOCX file in Google Docs or LibreOffice?',
        answer: 'Yes. The downloaded file adheres to the ISO OpenXML (.docx) specification, making it seamlessly compatible with Microsoft Word, Apple Pages, Google Docs, and LibreOffice.'
      },
      {
        question: 'Does this tool support scanned image PDFs?',
        answer: 'Our browser converter processes native digital text embedded in PDFs. For scanned camera photos or flattened bitmap PDFs, an optical character recognition (OCR) workflow is advised.'
      },
      {
        question: 'Are my business proposals or contracts uploaded to any third party?',
        answer: 'No. The entire conversion logic runs locally inside your browser window. Zero bytes are transmitted across the internet.'
      },
      {
        question: 'Can I convert multi-page PDF documents to Word?',
        answer: 'Yes, multi-page PDFs are parsed sequentially and compiled into a unified, continuous multi-page Word document.'
      },
      {
        question: 'Is this conversion service free with no subscription traps?',
        answer: 'Yes, our PDF to Word converter is completely free with no registration, no credit card prompt, and no hidden subscriptions.'
      }
    ],
    relatedSlugs: ['word-to-pdf', 'pdf-to-excel', 'pdf-to-jpg', 'extract-pdf-pages'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF document (.pdf)',
    allowMultiple: false,
    outputFilename: 'converted-document.docx',
    outputExtension: 'docx',
    iconName: 'FileText'
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    tier: 1,
    priorityStars: '★★★★★',
    category: 'convert',
    categoryLabel: 'Convert PDF',
    actionTitle: 'Convert PDF to JPG Online — High Resolution Image Extraction Free',
    metaDescription: 'Extract each page of your PDF into high-resolution JPG images in seconds. Zero uploads, crystal-clear rendering, and instant download in your browser.',
    shortDescription: 'Convert every PDF page into crisp, high-resolution JPG images instantly.',
    intro: 'Transforming PDF pages into universal JPG pictures allows you to embed slides into presentations, publish documentation on websites, and share previews across social media. Powered by modern HTML5 Canvas and client-side rendering engines, our converter renders each vector PDF page at high DPI resolution and outputs optimized JPG images straight to your download folder.',
    howItWorks: [
      'Drag and drop your PDF document into the designated drop zone.',
      'Our rendering engine draws each PDF page onto an internal high-resolution canvas element.',
      'Download your generated JPG images individually or as a complete bundle.'
    ],
    features: [
      'Sharp rendering at 2x device pixel ratio for crystal-clear typography and diagrams.',
      'Selectable compression balance between file compactness and visual fidelity.',
      'Batch conversion of all pages simultaneously with responsive preview cards.',
      'Strict local sandboxing ensures confidential slides and blueprints stay private.'
    ],
    faqs: [
      {
        question: 'What is the resolution quality of the exported JPG images?',
        answer: 'Pages are rendered using high-fidelity viewport scaling (up to 200-300 DPI equivalent) to ensure razor-sharp text and crisp illustrations.'
      },
      {
        question: 'How do I download multiple converted pages?',
        answer: 'You can download each converted page individually as a JPG file or download all pages concurrently.'
      },
      {
        question: 'Are any files saved on your servers?',
        answer: 'No. Everything is rendered directly in your browser using canvas graphics technology. No server storage exists.'
      },
      {
        question: 'Can I convert specific pages instead of the whole document?',
        answer: 'Yes. You can use our Extract PDF Pages tool beforehand or simply pick the rendered images you wish to download.'
      },
      {
        question: 'Does this tool work on Safari, Chrome, Edge, and Firefox?',
        answer: 'Yes, it works smoothly on all modern standards-compliant web browsers across desktop and mobile operating systems.'
      }
    ],
    relatedSlugs: ['jpg-to-pdf', 'pdf-to-png', 'png-to-pdf', 'pdf-preview'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF document (.pdf)',
    allowMultiple: false,
    outputFilename: 'page-1.jpg',
    outputExtension: 'jpg',
    iconName: 'Image'
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    tier: 1,
    priorityStars: '★★★★☆',
    category: 'convert',
    categoryLabel: 'Convert PDF',
    actionTitle: 'Convert JPG to PDF Online — Turn Images to PDF Documents Free',
    metaDescription: 'Combine JPG and JPEG photos into a clean, print-ready PDF file directly in your browser. Auto-oriented, customizable page margins, and 100% private.',
    shortDescription: 'Turn single or multiple JPG photos into a clean, professional PDF file.',
    intro: 'Converting pictures, smartphone receipts, scans, and photographic portfolios into a standardized PDF makes sharing and printing effortless. Our browser-based JPG to PDF converter imports your image files, calculates optimal dimensions, centers them within standard A4 or Letter page geometry, and generates a polished multi-page PDF document without uploading anything to remote servers.',
    howItWorks: [
      'Select or drop one or multiple JPG or JPEG pictures into the upload area.',
      'Arrange the image sequence and check page framing preferences.',
      'Click "Convert to PDF" to compile your images into an organized, downloadable PDF file.'
    ],
    features: [
      'Automatic orientation detection for portrait and landscape photographs.',
      'Multi-image batch support allowing you to stitch dozens of photos into one file.',
      'Embeds original image quality without lossy double-compression artifacts.',
      'Generates ISO standard PDF files ready for administrative archiving or printing.'
    ],
    faqs: [
      {
        question: 'Can I add multiple JPG images and merge them into a single PDF?',
        answer: 'Yes. You can select multiple JPGs at once, and each image will be compiled into its own sequential page in the output PDF.'
      },
      {
        question: 'Will my pictures lose quality during conversion?',
        answer: 'No. The image binary streams are encapsulated directly within the PDF container, maintaining full resolution without degradation.'
      },
      {
        question: 'Can I convert PNG files with this tool as well?',
        answer: 'Yes, standard PNG and JPG images are both accepted by our image conversion engine, or you can use our dedicated PNG to PDF tool.'
      },
      {
        question: 'Is my personal photo data secure?',
        answer: 'Completely. Because our processing is 100% client-side, your pictures never touch a server, cloud bucket, or external network.'
      },
      {
        question: 'What page sizes are supported in the output PDF?',
        answer: 'The output PDF automatically uses standard A4 dimensions with balanced margins, gracefully accommodating both landscape and portrait shots.'
      }
    ],
    relatedSlugs: ['pdf-to-jpg', 'png-to-pdf', 'merge-pdf', 'compress-pdf'],
    acceptedFileTypes: ['.jpg', '.jpeg', 'image/jpeg'],
    acceptDescription: 'Select one or more JPG images (.jpg, .jpeg)',
    allowMultiple: true,
    outputFilename: 'images-combined.pdf',
    outputExtension: 'pdf',
    iconName: 'FileImage'
  },
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    tier: 1,
    priorityStars: '★★★★☆',
    category: 'core',
    categoryLabel: 'Core PDF Tools',
    actionTitle: 'Split PDF Online — Extract Individual Pages or Ranges from PDF Free',
    metaDescription: 'Split a large PDF file into separate single-page documents or custom page ranges online. Fast, browser-based, secure, and completely free.',
    shortDescription: 'Separate a large PDF into individual pages or distinct section ranges.',
    intro: 'Need to isolate a single chapter from an eBook, split a bulky statement into separate monthly sheets, or remove unwanted attachments from a dossier? Our client-side Split PDF utility lets you divide any PDF file into individual standalone pages in seconds. Each split page preserves its underlying fonts, formatting, and assets with mathematical precision.',
    howItWorks: [
      'Upload your multi-page PDF document to the interactive workspace.',
      'Review the detected page count and select whether to split every page or specific segments.',
      'Click "Split PDF" and instantly download your separated PDF documents.'
    ],
    features: [
      'Split every page into an independent single-page PDF document in one click.',
      'Extract custom ranges without disturbing the original document integrity.',
      'High-speed in-browser page tree extraction powered by client-side WebAssembly.',
      'Private and safe: legal documents and financial statements never leave your device.'
    ],
    faqs: [
      {
        question: 'Does splitting a PDF damage the original file on my computer?',
        answer: 'Never. The original file remains untouched on your disk. The tool simply creates fresh, smaller PDF files based on your selection.'
      },
      {
        question: 'Can I split a document with hundreds of pages?',
        answer: 'Yes. Our engine uses virtual memory management to process large documents smoothly directly within modern browser tabs.'
      },
      {
        question: 'What happens to hyperlinks and bookmarks in split pages?',
        answer: 'All page-level annotations, links, and vector assets belonging to the extracted pages are cleanly preserved.'
      },
      {
        question: 'Are there any usage quotas or daily download limits?',
        answer: 'No. You can split as many files and pages as needed with unlimited access, zero ads, and zero registration requirements.'
      },
      {
        question: 'How do I download all split pages?',
        answer: 'The application allows you to download each extracted page independently or save all generated parts directly.'
      }
    ],
    relatedSlugs: ['merge-pdf', 'extract-pdf-pages', 'delete-pdf-pages', 'organize-pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a multi-page PDF document (.pdf)',
    allowMultiple: false,
    outputFilename: 'split-page-1.pdf',
    outputExtension: 'pdf',
    iconName: 'Scissors'
  },
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    tier: 1,
    priorityStars: '★★★★☆',
    category: 'convert',
    categoryLabel: 'Convert PDF',
    actionTitle: 'Convert Word to PDF Online — Free DOCX to PDF In Your Browser',
    metaDescription: 'Convert Microsoft Word DOCX documents into clean, professional PDF files directly in your web browser. Free, secure, and zero server uploads.',
    shortDescription: 'Convert Microsoft Word (.docx) documents into polished, standardized PDF files.',
    intro: 'Sharing Word documents across different computers often leads to accidental font substitution, misaligned margins, and unexpected edits. Converting your Word document to PDF locks in the formatting permanently so every recipient sees your document exactly as intended. Our client-side Word to PDF converter parses the document hierarchy and renders a faithful, publication-ready PDF in your browser.',
    howItWorks: [
      'Drag and drop your .docx file into the conversion interface.',
      'Our engine translates document styles, headings, tables, and paragraphs into vector PDF layout.',
      'Download your final, tamper-resistant PDF file with one click.'
    ],
    features: [
      'Instant conversion from .docx to standardized PDF without requiring Microsoft Office.',
      'Locks typographical layout, headers, paragraphs, and lists across all viewing platforms.',
      'Completely client-side execution ensures confidential resumes and proposals stay safe.',
      'Lightweight and optimized output files ready for email attachments or printing.'
    ],
    faqs: [
      {
        question: 'Do I need Microsoft Word installed on my computer?',
        answer: 'No. The conversion is executed entirely through our web-based parser without requiring Microsoft Office, Word 365, or third-party plugins.'
      },
      {
        question: 'Does this tool support older .doc binary files?',
        answer: 'The tool is engineered for modern standard .docx OpenXML files. If you have an older .doc file, save it as .docx first before converting.'
      },
      {
        question: 'Will my formatting and fonts look accurate?',
        answer: 'Yes. Headings, paragraph spacing, bold text, lists, and tables are carefully parsed and translated into vector PDF elements.'
      },
      {
        question: 'Is my document transmitted over the internet?',
        answer: 'No. The conversion occurs inside your local browser tab. No server-side storage or cloud transfer is utilized.'
      },
      {
        question: 'Can I convert multiple Word documents in a row?',
        answer: 'Yes, you can convert as many documents as you need sequentially with zero restrictions.'
      }
    ],
    relatedSlugs: ['pdf-to-word', 'excel-to-pdf', 'merge-pdf', 'compress-pdf'],
    acceptedFileTypes: ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    acceptDescription: 'Select a Word document (.docx)',
    allowMultiple: false,
    outputFilename: 'converted-document.pdf',
    outputExtension: 'pdf',
    iconName: 'FileCheck'
  },

  // --- TIER 2 ---
  {
    slug: 'pdf-to-png',
    name: 'PDF to PNG',
    tier: 2,
    priorityStars: '★★★☆☆',
    category: 'convert',
    categoryLabel: 'Convert PDF',
    actionTitle: 'Convert PDF to PNG Online — Lossless Transparent Image Extraction',
    metaDescription: 'Convert PDF pages into high-definition, lossless PNG images online. Ideal for graphics, illustrations, charts, and digital publication with zero uploads.',
    shortDescription: 'Render PDF pages into lossless, crystal-clear PNG images with pristine detail.',
    intro: 'When visual clarity and uncompressed graphic detail matter most, PNG is the format of choice. Our PDF to PNG converter renders every vector path, typography serif, and line chart into pixel-perfect, lossless PNG images. Because PNG avoids the compression artifacts inherent to JPG, it is ideal for technical blueprints, scientific graphs, and creative design assets.',
    howItWorks: [
      'Upload your PDF file to the client-side conversion canvas.',
      'The renderer rasterizes vector elements at optimal resolution into lossless PNG buffers.',
      'Download your pristine PNG images directly to your computer or phone.'
    ],
    features: [
      'Lossless pixel fidelity ideal for intricate diagrams, schematics, and text charts.',
      'Sharp rendering preserving razor-sharp typography without blur or noise.',
      'Local execution ensures maximum privacy for proprietary design specifications.',
      'Supports high-resolution display scaling and print-quality rasterization.'
    ],
    faqs: [
      {
        question: 'What is the main advantage of PNG over JPG for PDF pages?',
        answer: 'PNG uses lossless compression, which prevents compression noise around text characters, sharp line art, and high-contrast vector charts.'
      },
      {
        question: 'Can I convert multi-page documents to PNG?',
        answer: 'Yes, each page is individually rendered and made available for immediate download.'
      },
      {
        question: 'Are there resolution settings available?',
        answer: 'Our engine automatically renders at retina 2x pixel density to guarantee crispness on modern 4K displays.'
      },
      {
        question: 'Are my graphics kept secure?',
        answer: 'Yes. No images or documents are ever uploaded to any server. Everything executes locally in your browser.'
      },
      {
        question: 'Is there a limit on how many times I can use the tool?',
        answer: 'No limits exist. You can convert unlimited files completely free.'
      }
    ],
    relatedSlugs: ['pdf-to-jpg', 'png-to-pdf', 'jpg-to-pdf', 'pdf-preview'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF document (.pdf)',
    allowMultiple: false,
    outputFilename: 'page-1.png',
    outputExtension: 'png',
    iconName: 'ImageIcon'
  },
  {
    slug: 'png-to-pdf',
    name: 'PNG to PDF',
    tier: 2,
    priorityStars: '★★★☆☆',
    category: 'convert',
    categoryLabel: 'Convert PDF',
    actionTitle: 'Convert PNG to PDF Online — High-Quality Image to PDF Generator',
    metaDescription: 'Convert PNG image files into clean, professional PDF documents. Combine multiple transparent or high-res graphics into one organized PDF privately.',
    shortDescription: 'Compile single or multiple PNG graphics into a standardized PDF document.',
    intro: 'Transform digital illustrations, UI mockups, infographics, and scanned PNG receipts into an organized, distributable PDF document. Our PNG to PDF utility reads your image headers, handles dimensions dynamically, centers each asset within calibrated margins, and creates an archival-grade PDF file right in your browser.',
    howItWorks: [
      'Select or drag PNG files into the browser conversion panel.',
      'Review your images and verify the desired page sequence.',
      'Click "Convert to PDF" to generate and download your polished document.'
    ],
    features: [
      'Encapsulates PNG pixel data directly into PDF streams without quality loss.',
      'Batch conversion compiles multiple images into sequential document pages.',
      'Responsive client-side processing with zero server dependencies or queues.',
      'Universal compatibility with standard desktop and mobile PDF viewers.'
    ],
    faqs: [
      {
        question: 'Will PNG transparency be preserved or turned black?',
        answer: 'The converter renders transparent PNG backgrounds over a clean white page canvas, ensuring professional document presentation.'
      },
      {
        question: 'Can I upload multiple PNG files at the same time?',
        answer: 'Yes, you can upload multiple PNGs simultaneously to compile a multi-page document.'
      },
      {
        question: 'Does this tool work on mobile devices?',
        answer: 'Yes, modern mobile browsers on both iOS and Android are fully supported.'
      },
      {
        question: 'Are my graphic designs kept private?',
        answer: 'Yes. Since no file upload occurs, your images remain confidential on your personal device.'
      },
      {
        question: 'Is there a watermark added to the output PDF?',
        answer: 'Never. Our tools are 100% free with zero watermarks, zero ads, and no hidden subscriptions.'
      }
    ],
    relatedSlugs: ['jpg-to-pdf', 'pdf-to-png', 'merge-pdf', 'compress-pdf'],
    acceptedFileTypes: ['.png', 'image/png'],
    acceptDescription: 'Select one or more PNG files (.png)',
    allowMultiple: true,
    outputFilename: 'png-document.pdf',
    outputExtension: 'pdf',
    iconName: 'FileImage'
  },
  {
    slug: 'excel-to-pdf',
    name: 'Excel to PDF',
    tier: 2,
    priorityStars: '★★★☆☆',
    category: 'convert',
    categoryLabel: 'Convert PDF',
    actionTitle: 'Convert Excel to PDF Online — Transform XLSX Spreadsheets to PDF Free',
    metaDescription: 'Convert Excel (.xlsx) spreadsheets into clean, printable PDF documents directly in your browser. Preserve tables, rows, and values with 100% privacy.',
    shortDescription: 'Transform Excel (.xlsx) spreadsheets into clean, printable PDF tables.',
    intro: 'Sharing raw spreadsheets can expose complex formulas or risk accidental cell edits by clients and stakeholders. Converting your spreadsheet to PDF presents your data as an immutable, professionally formatted report. Our browser-based Excel to PDF tool parses workbook sheets, columns, and data cells into crisp, print-ready PDF tables with zero server transmission.',
    howItWorks: [
      'Upload your Excel spreadsheet (.xlsx) into the dropzone.',
      'Our engine reads the active worksheets, grid rows, and cell values.',
      'Download your generated PDF report with neatly formatted tabular layouts.'
    ],
    features: [
      'Parses multi-row and multi-column spreadsheets into organized printable tables.',
      'Protects confidential financial models by converting active formulas into static reports.',
      'Fast client-side calculation using lightweight WebAssembly spreadsheet parsers.',
      'Ensures consistent presentation regardless of recipient operating system or software.'
    ],
    faqs: [
      {
        question: 'Does this tool support both .xlsx and .xls formats?',
        answer: 'Modern standard .xlsx workbooks are fully supported. For legacy .xls files, resave as .xlsx in Excel before conversion.'
      },
      {
        question: 'Are my financial calculations or company figures uploaded anywhere?',
        answer: 'No. The entire parsing process executes locally in your browser memory. Data never leaves your machine.'
      },
      {
        question: 'How are wide tables with many columns handled?',
        answer: 'The converter adapts column widths and splits wide tables into readable, paginated document views.'
      },
      {
        question: 'Do I need Microsoft Excel or Office installed?',
        answer: 'No, everything is processed directly through modern browser capabilities without third-party dependencies.'
      },
      {
        question: 'Can I convert multiple sheets from a single workbook?',
        answer: 'The converter renders data from the primary active worksheets into sequential pages in the output PDF.'
      }
    ],
    relatedSlugs: ['pdf-to-excel', 'word-to-pdf', 'pdf-to-word', 'compress-pdf'],
    acceptedFileTypes: ['.xlsx', '.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    acceptDescription: 'Select an Excel spreadsheet (.xlsx, .xls)',
    allowMultiple: false,
    outputFilename: 'spreadsheet-report.pdf',
    outputExtension: 'pdf',
    iconName: 'Sheet'
  },
  {
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    tier: 2,
    priorityStars: '★★★☆☆',
    category: 'convert',
    categoryLabel: 'Convert PDF',
    actionTitle: 'Convert PDF to Excel Online — Extract Tables to XLSX Free',
    metaDescription: 'Extract tabular data and numerical rows from PDF files into editable Microsoft Excel (.xlsx) spreadsheets online. Fast, secure, and client-side.',
    shortDescription: 'Extract tabular data and numerical rows from PDF files into editable Excel spreadsheets.',
    intro: 'Copying numerical data from invoices, balance sheets, and research papers trapped in PDF format usually results in broken columns and wasted hours. Our client-side PDF to Excel tool analyzes geometric text coordinates and delimiter spacing across document pages, structuring them into clean rows and columns in a downloadable, editable .xlsx workbook.',
    howItWorks: [
      'Drop your tabular PDF file into the secure conversion panel.',
      'The engine detects geometric alignments, line groupings, and cell values.',
      'Download your clean, editable Microsoft Excel (.xlsx) spreadsheet.'
    ],
    features: [
      'Structures extracted figures into editable rows, columns, and worksheets.',
      'Eliminates laborious manual data entry for financial statements and audits.',
      '100% private processing keeps banking records and sales figures strictly confidential.',
      'Generates standard OpenXML (.xlsx) files compatible with Excel, Sheets, and Calc.'
    ],
    faqs: [
      {
        question: 'How accurate is table extraction from complex PDFs?',
        answer: 'The tool provides best-effort geometric coordinate clustering, working exceptionally well on digitally generated tabular PDFs.'
      },
      {
        question: 'Can I open the resulting file in Google Sheets or Apple Numbers?',
        answer: 'Yes, the generated .xlsx file is fully compliant with all major spreadsheet applications.'
      },
      {
        question: 'Does this work on scanned image receipts?',
        answer: 'It works best with native digital PDFs containing embedded text. Flattened scans require OCR preprocessing.'
      },
      {
        question: 'Are my company numbers uploaded to external cloud APIs?',
        answer: 'No. All parsing logic executes entirely within your browser tab, ensuring total commercial secrecy.'
      },
      {
        question: 'Is there a limit on row or page count?',
        answer: 'No arbitrary limits are imposed. The conversion capability is bounded only by your device memory.'
      }
    ],
    relatedSlugs: ['excel-to-pdf', 'pdf-to-word', 'word-to-pdf', 'extract-pdf-pages'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF containing tables (.pdf)',
    allowMultiple: false,
    outputFilename: 'extracted-table.xlsx',
    outputExtension: 'xlsx',
    iconName: 'Table'
  },
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    tier: 2,
    priorityStars: '★★★☆☆',
    category: 'core',
    categoryLabel: 'Core PDF Tools',
    actionTitle: 'Rotate PDF Online — Permanently Rotate PDF Pages 90, 180, or 270 Degrees',
    metaDescription: 'Rotate upside-down or sideways PDF pages permanently online. Fix document orientation in 90-degree increments right in your browser for free.',
    shortDescription: 'Fix upside-down or sideways pages by rotating them permanently in 90° increments.',
    intro: 'Scanned contracts and mobile document photographs often end up sideways or upside down, frustrating readers and reviewers. Our Rotate PDF tool allows you to reorient your PDF pages permanently by 90, 180, or 270 degrees clockwise or counterclockwise. The rotation metadata is saved directly into the PDF specification so the document opens correctly in every reader.',
    howItWorks: [
      'Upload your PDF file to the rotation tool.',
      'Select your desired rotation angle (90° clockwise, 180°, or 90° counterclockwise).',
      'Click "Rotate PDF" and download your properly oriented document immediately.'
    ],
    features: [
      'Rotates all pages or specific targets in exact 90-degree increments.',
      'Modifies standard PDF rotation dictionary entries without degrading vector quality.',
      'Fast client-side operation: fix large presentations or agreements in milliseconds.',
      'Guarantees your confidential files remain 100% private without cloud uploads.'
    ],
    faqs: [
      {
        question: 'Will rotating my PDF make the text or images blurry?',
        answer: 'No. Rotating simply updates the page display orientation matrix in the PDF structure without re-compressing contents.'
      },
      {
        question: 'Will the rotation stay permanent when emailed to other people?',
        answer: 'Yes. The updated orientation is written permanently into the file dictionary, ensuring it displays correctly everywhere.'
      },
      {
        question: 'Can I rotate individual pages differently from others?',
        answer: 'You can choose to rotate all pages universally or split and reassemble specific pages using our companion tools.'
      },
      {
        question: 'Is there any cost or subscription needed?',
        answer: 'None at all. The tool is completely free with no usage caps or watermarks.'
      },
      {
        question: 'Are my documents safe from third-party interception?',
        answer: 'Completely. Because no network transmission occurs, your documents are shielded from external exposure.'
      }
    ],
    relatedSlugs: ['organize-pdf', 'delete-pdf-pages', 'merge-pdf', 'split-pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF to rotate (.pdf)',
    allowMultiple: false,
    outputFilename: 'rotated-document.pdf',
    outputExtension: 'pdf',
    iconName: 'RotateCw'
  },
  {
    slug: 'extract-pdf-pages',
    name: 'Extract PDF Pages',
    tier: 2,
    priorityStars: '★★★☆☆',
    category: 'core',
    categoryLabel: 'Core PDF Tools',
    actionTitle: 'Extract PDF Pages Online — Pull Specific Pages Out of PDF Free',
    metaDescription: 'Extract specific pages or page intervals from any PDF into a new standalone document. Fast, client-side, 100% private, and completely free.',
    shortDescription: 'Pull selected pages or custom ranges out of a PDF into a clean new document.',
    intro: 'When you only need a couple of relevant pages from a massive manual, legal briefing, or annual financial report, sending the full document is inefficient. Our Extract PDF Pages utility lets you specify individual page numbers or ranges (e.g. 1, 3-5, 8) and cleanly packages only those selected pages into a fresh, compact PDF document in your browser.',
    howItWorks: [
      'Drop your PDF file into the page extractor tool.',
      'Enter the specific page numbers or ranges you wish to extract (e.g., "1, 3, 5-7").',
      'Click "Extract Pages" to download your tailored new PDF document.'
    ],
    features: [
      'Flexible range syntax allows extracting individual sheets or consecutive chapters.',
      'Retains all original typography, embedded vectors, and page annotations.',
      'Instantaneous client-side execution powered by optimized browser memory handling.',
      'Absolute data privacy: confidential filings never pass through any cloud server.'
    ],
    faqs: [
      {
        question: 'How do I specify which pages to extract?',
        answer: 'You can enter comma-separated numbers and hyphenated ranges such as "1, 3, 5-8" in the extraction input box.'
      },
      {
        question: 'Does extracting pages alter the source file on my computer?',
        answer: 'No. The source file remains completely unchanged. A separate new PDF is generated containing only your chosen pages.'
      },
      {
        question: 'Can I extract non-consecutive pages into a single output PDF?',
        answer: 'Yes. You can combine diverse pages like "2, 7, 14" into one sequential output file.'
      },
      {
        question: 'Is my document uploaded to a server for processing?',
        answer: 'No. The entire extraction pipeline is executed locally within your browser using WebAssembly.'
      },
      {
        question: 'What happens if I type an invalid page number?',
        answer: 'Our validation logic flags out-of-range numbers immediately to prevent corrupted outputs.'
      }
    ],
    relatedSlugs: ['delete-pdf-pages', 'split-pdf', 'merge-pdf', 'organize-pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF document (.pdf)',
    allowMultiple: false,
    outputFilename: 'extracted-pages.pdf',
    outputExtension: 'pdf',
    iconName: 'FileCheck2'
  },
  {
    slug: 'delete-pdf-pages',
    name: 'Delete PDF Pages',
    tier: 2,
    priorityStars: '★★★☆☆',
    category: 'core',
    categoryLabel: 'Core PDF Tools',
    actionTitle: 'Delete PDF Pages Online — Remove Unwanted Pages from PDF Free',
    metaDescription: 'Remove blank, duplicate, or sensitive pages from your PDF file online. Fast, secure, client-side page deletion with zero uploads and zero watermarks.',
    shortDescription: 'Remove unwanted, blank, or sensitive pages from your PDF in seconds.',
    intro: 'Blank filler pages, obsolete appendices, and confidential exhibits frequently need to be removed before distributing a PDF to clients or publishing it online. With our Delete PDF Pages tool, you can specify exactly which pages to discard. The tool reconstructs the document page tree cleanly, leaving you with a streamlined, ready-to-share PDF in seconds.',
    howItWorks: [
      'Upload your PDF to the page deletion workspace.',
      'Indicate the page numbers you want removed from the document (e.g., "2, 4, 6").',
      'Click "Delete Pages" to download your clean, pruned PDF document.'
    ],
    features: [
      'Simple page removal syntax for discarding individual or grouped pages.',
      'Re-indexes internal cross-reference tables cleanly to ensure perfect compatibility.',
      'Zero server transmission ensures company secrets and private notes are never exposed.',
      'Instant client-side output without queues, watermarks, or email requirements.'
    ],
    faqs: [
      {
        question: 'What page numbering format should I use to delete pages?',
        answer: 'Simply enter page numbers separated by commas, like "1, 4, 9", or ranges like "3-5".'
      },
      {
        question: 'Can I delete multiple pages at once?',
        answer: 'Yes, you can specify as many pages as needed in a single command.'
      },
      {
        question: 'Will deleting pages affect the numbering of remaining pages?',
        answer: 'The remaining pages are re-sequenced naturally in the output document without gaps.'
      },
      {
        question: 'Does the tool upload my PDF to any server?',
        answer: 'No. Everything is calculated in memory inside your browser. No files leave your device.'
      },
      {
        question: 'Can I delete all pages except one?',
        answer: 'Yes, as long as at least one valid page remains in the final document.'
      }
    ],
    relatedSlugs: ['extract-pdf-pages', 'split-pdf', 'organize-pdf', 'compress-pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF document (.pdf)',
    allowMultiple: false,
    outputFilename: 'pages-removed.pdf',
    outputExtension: 'pdf',
    iconName: 'Trash2'
  },
  {
    slug: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    tier: 2,
    priorityStars: '★★★☆☆',
    category: 'convert',
    categoryLabel: 'Convert PDF',
    actionTitle: 'Convert PowerPoint to PDF Online — Free PPTX to PDF in Browser',
    metaDescription: 'Convert PowerPoint (.pptx) presentations to portable PDF slide decks online. Ensure slide layouts, fonts, and graphics display identically everywhere.',
    shortDescription: 'Turn PowerPoint (.pptx) presentation decks into standardized PDF slides.',
    intro: 'Presenting slide decks on different conference room laptops often results in missing fonts, broken animations, or displaced text blocks. Converting your PowerPoint slides into a PDF locks in every element permanently, guaranteeing a smooth presentation experience. Our in-browser PPTX to PDF converter converts slides into a standardized PDF deck with complete privacy.',
    howItWorks: [
      'Select or drag your .pptx slide deck into the conversion zone.',
      'Our engine processes presentation slides, vector text, and graphics.',
      'Download your presentation as a standardized, universal PDF document.'
    ],
    features: [
      'Locks slide typography and graphics so they look identical across all computers.',
      'Eliminates presentation anxiety caused by missing fonts or different PowerPoint versions.',
      'Runs locally in browser memory for complete confidentiality of business pitch decks.',
      'Ideal for distributing presentation handouts, webinar slides, and speaker notes.'
    ],
    faqs: [
      {
        question: 'Do I need Microsoft PowerPoint installed on my machine?',
        answer: 'No. The conversion operates independently in your browser without requiring PowerPoint or Office 365.'
      },
      {
        question: 'What presentation formats are supported?',
        answer: 'Standard modern .pptx presentation files are supported.'
      },
      {
        question: 'Are my confidential pitch decks uploaded to the cloud?',
        answer: 'No. The file parsing and PDF generation happen 100% locally on your computer.'
      },
      {
        question: 'Will speaker notes be displayed on the slide pages?',
        answer: 'The converter focuses on slide canvas graphics and text runs, creating a clean visual deck.'
      },
      {
        question: 'Is there a limit on how many slides a deck can have?',
        answer: 'No artificial slide limits exist. Processing is limited only by your browser tab memory.'
      }
    ],
    relatedSlugs: ['pdf-to-powerpoint', 'word-to-pdf', 'pdf-to-jpg', 'compress-pdf'],
    acceptedFileTypes: ['.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    acceptDescription: 'Select a PowerPoint file (.pptx)',
    allowMultiple: false,
    outputFilename: 'presentation-slides.pdf',
    outputExtension: 'pdf',
    iconName: 'Presentation'
  },
  {
    slug: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    tier: 2,
    priorityStars: '★★★☆☆',
    category: 'convert',
    categoryLabel: 'Convert PDF',
    actionTitle: 'Convert PDF to PowerPoint Online — Export PDF Pages to PPTX Slides Free',
    metaDescription: 'Convert PDF slides and presentations into Microsoft PowerPoint (.pptx) decks online. Free, browser-based, private, and compatible with all presentation tools.',
    shortDescription: 'Convert PDF presentation pages into editable Microsoft PowerPoint (.pptx) slides.',
    intro: 'Reconstructing presentation slides from a PDF handout is usually tedious. Our client-side PDF to PowerPoint tool transforms each page of your PDF into an individual slide inside a genuine Microsoft PowerPoint (.pptx) file. The resulting presentation is immediately ready for editing, reorganization, and presenting in PowerPoint, Keynote, or Google Slides.',
    howItWorks: [
      'Upload your PDF presentation file to the converter.',
      'Our engine processes each page into a formatted slide within an OpenXML container.',
      'Download your .pptx presentation deck and begin editing slides right away.'
    ],
    features: [
      'Creates native .pptx files fully compatible with Microsoft PowerPoint, Keynote, and Google Slides.',
      'Maps each PDF page into a calibrated widescreen or standard slide canvas.',
      'Completely client-side processing keeps quarterly reports and executive decks private.',
      'Zero download fees, zero watermarks, and no user registration required.'
    ],
    faqs: [
      {
        question: 'Can I open the generated presentation in Google Slides?',
        answer: 'Yes, the resulting .pptx file imports smoothly into Google Slides, Apple Keynote, and LibreOffice Impress.'
      },
      {
        question: 'Are my business slides uploaded to external servers?',
        answer: 'No. All conversion logic runs locally inside your browser window. Zero data is uploaded.'
      },
      {
        question: 'What slide aspect ratio is used for the output?',
        answer: 'The presentation slide dimensions adapt to the aspect ratio of the input PDF pages.'
      },
      {
        question: 'Can I reorder or delete slides once in PowerPoint?',
        answer: 'Yes, you can edit, reorder, add animations, and customize the slides freely.'
      },
      {
        question: 'Is there a limit on how many presentations I can convert?',
        answer: 'No limits exist. You can convert as many files as you like for free.'
      }
    ],
    relatedSlugs: ['powerpoint-to-pdf', 'pdf-to-word', 'pdf-to-jpg', 'extract-pdf-pages'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF presentation (.pdf)',
    allowMultiple: false,
    outputFilename: 'converted-slides.pptx',
    outputExtension: 'pptx',
    iconName: 'FileSpreadsheet'
  },

  // --- TIER 3 ---
  {
    slug: 'pdf-watermark',
    name: 'Add Watermark to PDF',
    tier: 3,
    priorityStars: '★★☆☆☆',
    category: 'utility',
    categoryLabel: 'PDF Utilities',
    actionTitle: 'Add Watermark to PDF Online — Protect Documents with Custom Text Watermarks',
    metaDescription: 'Add custom text watermarks to your PDF pages online. Customize text, opacity, and rotation directly in your browser with 100% privacy and zero uploads.',
    shortDescription: 'Stamp custom semi-transparent text watermarks across every page of your PDF.',
    intro: 'Marking draft versions, stamping confidential contracts, or branding proprietary whitepapers with custom watermarks is essential for protecting intellectual property. Our Add Watermark to PDF tool stamps your custom text (such as "CONFIDENTIAL", "DRAFT", or your company name) across every page at calibrated opacity and angle directly in your browser.',
    howItWorks: [
      'Upload your PDF file to the watermarking tool.',
      'Enter your desired watermark text and configure styling options.',
      'Click "Add Watermark" to download your securely stamped PDF document.'
    ],
    features: [
      'Custom text stamping across all document pages at calibrated angles and opacity.',
      'Prevents unauthorized document leaks and clarifies draft vs final revision status.',
      '100% client-side vector stamping preserves underlying text and image sharpness.',
      'Instant processing with zero server uploads and zero file retention.'
    ],
    faqs: [
      {
        question: 'Can the watermark be easily removed by recipients?',
        answer: 'The watermark text is embedded into the vector content streams of the document, making casual removal difficult.'
      },
      {
        question: 'Can I customize the opacity and rotation of the watermark text?',
        answer: 'Yes, the tool applies an optimal 45-degree angle with balanced semi-transparency so reading remains comfortable.'
      },
      {
        question: 'Will the watermark make underlying text unreadable?',
        answer: 'No. The semi-transparent opacity ensures the original content remains completely legible.'
      },
      {
        question: 'Are my confidential documents uploaded anywhere?',
        answer: 'No. All rendering and vector stamping happens locally in your browser.'
      },
      {
        question: 'Is this watermarking tool completely free to use?',
        answer: 'Yes, 100% free with unlimited document usage and zero watermarks of our own.'
      }
    ],
    relatedSlugs: ['protect-pdf', 'pdf-metadata-remover', 'compress-pdf', 'merge-pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF document (.pdf)',
    allowMultiple: false,
    outputFilename: 'watermarked-document.pdf',
    outputExtension: 'pdf',
    iconName: 'Stamp'
  },
  {
    slug: 'protect-pdf',
    name: 'Password Protect PDF',
    tier: 3,
    priorityStars: '★★☆☆☆',
    category: 'utility',
    categoryLabel: 'PDF Utilities',
    actionTitle: 'Password Protect PDF Online — Encrypt PDF Files with Strong Password Free',
    metaDescription: 'Encrypt and password protect your PDF files online. Secure personal records, financial statements, and contracts directly in your browser with zero uploads.',
    shortDescription: 'Encrypt your PDF documents with a secure password to prevent unauthorized access.',
    intro: 'Safeguard sensitive tax filings, bank statements, medical records, and legal agreements from unauthorized eyes. Our Password Protect PDF tool applies standard cryptographic encryption directly within your browser, ensuring that only recipients who hold the correct password can open and view the document.',
    howItWorks: [
      'Select or drop your unprotected PDF file into the security panel.',
      'Enter and confirm a strong password for your document.',
      'Click "Protect PDF" to download your securely encrypted PDF file.'
    ],
    features: [
      'Standard cryptographic encryption compatible with all major PDF viewers.',
      'Restricts unauthorized viewing, printing, and extraction without the correct passkey.',
      'Client-side encryption ensures your password and document are never seen by any server.',
      'Fast, simple protection for sensitive legal, financial, and healthcare records.'
    ],
    faqs: [
      {
        question: 'What encryption standard is applied to the PDF?',
        answer: 'The tool uses standard PDF cryptographic security dictionaries compatible with Adobe Acrobat and all standard viewers.'
      },
      {
        question: 'Is my password sent to your servers?',
        answer: 'Never. The encryption algorithms run locally on your device in JavaScript. We never see your password or your files.'
      },
      {
        question: 'Can I recover my password if I forget it?',
        answer: 'No. Because encryption is performed locally with genuine cryptographic keys, keep a secure note of your password.'
      },
      {
        question: 'Will the protected PDF open on phones and tablets?',
        answer: 'Yes. Any standard PDF viewer on iPhone, Android, Mac, or Windows will prompt for the password when opening the file.'
      },
      {
        question: 'Is there a charge for encrypting documents?',
        answer: 'No, it is completely free with unlimited usage.'
      }
    ],
    relatedSlugs: ['unlock-pdf', 'pdf-watermark', 'pdf-metadata-remover', 'compress-pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF document (.pdf)',
    allowMultiple: false,
    outputFilename: 'protected-document.pdf',
    outputExtension: 'pdf',
    iconName: 'Lock'
  },
  {
    slug: 'unlock-pdf',
    name: 'Remove PDF Password',
    tier: 3,
    priorityStars: '★★★☆☆',
    category: 'utility',
    categoryLabel: 'PDF Utilities',
    actionTitle: 'Unlock PDF Online — Remove Password Protection from PDF Files Free',
    metaDescription: 'Remove password protection from authorized PDF files online. Decrypt and save an unencrypted version of your document directly in your browser.',
    shortDescription: 'Remove password restrictions from authorized PDFs to create unencrypted copies.',
    intro: 'Constantly re-entering passwords on bank statements, insurance policies, or utility bills every time you open them can be frustrating. If you know the password to your protected document, our Unlock PDF tool decrypts the file in your browser and exports a permanent, unencrypted copy so you can view, edit, and share it seamlessly.',
    howItWorks: [
      'Upload your password-protected PDF document.',
      'Type the valid password to authorize decryption.',
      'Click "Unlock PDF" to download a permanently unencrypted version of your file.'
    ],
    features: [
      'Removes recurring password prompts from your authorized personal documents.',
      'Restores full editing, printing, and copying capabilities to restricted files.',
      'Safe client-side decryption ensures credentials and contents remain strictly private.',
      'Fast processing with zero waiting queues, watermarks, or subscription requirements.'
    ],
    faqs: [
      {
        question: 'Do I need to know the password to unlock the PDF?',
        answer: 'Yes. To decrypt the document legitimately, you must provide the valid owner or user password.'
      },
      {
        question: 'Are my passwords transmitted over the internet?',
        answer: 'No. Decryption occurs purely inside your browser memory. Nothing is transmitted over the network.'
      },
      {
        question: 'Will unlocking alter the contents of my document?',
        answer: 'No. The pages, text, graphics, and layout remain completely identical; only the encryption lock is removed.'
      },
      {
        question: 'Can I re-encrypt the file later if needed?',
        answer: 'Yes, you can use our Password Protect PDF tool at any time to re-apply encryption.'
      },
      {
        question: 'Does this tool work on mobile devices?',
        answer: 'Yes, it works smoothly on all modern smartphones, tablets, and desktop computers.'
      }
    ],
    relatedSlugs: ['protect-pdf', 'pdf-watermark', 'compress-pdf', 'organize-pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a password-protected PDF (.pdf)',
    allowMultiple: false,
    outputFilename: 'unlocked-document.pdf',
    outputExtension: 'pdf',
    iconName: 'Unlock'
  },
  {
    slug: 'sign-pdf',
    name: 'Sign PDF Online',
    tier: 3,
    priorityStars: '★★★☆☆',
    category: 'utility',
    categoryLabel: 'PDF Utilities',
    actionTitle: 'Sign PDF Online — Draw Signature and Sign Documents Free in Browser',
    metaDescription: 'Sign PDF documents online for free. Draw your digital signature on canvas, place it on any page, and download the signed document with 100% privacy.',
    shortDescription: 'Draw your signature on canvas and place it seamlessly onto your PDF pages.',
    intro: 'Printing contracts, signing them with a pen, and scanning them back into a computer is slow and wasteful. Our Sign PDF Online tool lets you draw your handwritten signature directly on your touchscreen or with your mouse, position it onto any page of your document, and embed it cleanly into the PDF without sending your signature to any remote server.',
    howItWorks: [
      'Upload the PDF document you need to sign.',
      'Draw your signature on the interactive canvas pad.',
      'Click "Sign PDF" to embed your signature and download the finalized signed document.'
    ],
    features: [
      'Interactive signature drawing pad with smooth stroke rendering and clear controls.',
      'Flattens your signature directly onto document pages without shifting existing elements.',
      '100% private: your signature image and legal contracts never leave your device.',
      'Perfect for signing leases, vendor agreements, tax forms, and employment offers.'
    ],
    faqs: [
      {
        question: 'Is my handwritten signature saved or stored on any server?',
        answer: 'Never. Your signature drawing and document are processed exclusively in your browser memory and discarded when you close the tab.'
      },
      {
        question: 'Can I draw my signature using a touch screen or stylus?',
        answer: 'Yes, the drawing pad supports fingers, touch styluses, and mouse or trackpad inputs.'
      },
      {
        question: 'Will the signed document be legally recognized?',
        answer: 'In most jurisdictions, electronic signatures are legally valid for everyday commercial agreements, leases, and receipts.'
      },
      {
        question: 'Can I sign multi-page documents?',
        answer: 'Yes, your signature can be applied directly to the document.'
      },
      {
        question: 'Is there a limit on how many documents I can sign for free?',
        answer: 'No limits exist. You can sign unlimited documents completely free of charge.'
      }
    ],
    relatedSlugs: ['fill-pdf-forms', 'protect-pdf', 'pdf-watermark', 'compress-pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF to sign (.pdf)',
    allowMultiple: false,
    outputFilename: 'signed-document.pdf',
    outputExtension: 'pdf',
    iconName: 'PenTool'
  },
  {
    slug: 'pdf-metadata-viewer',
    name: 'View PDF Metadata',
    tier: 3,
    priorityStars: '★★☆☆☆',
    category: 'utility',
    categoryLabel: 'PDF Utilities',
    actionTitle: 'View PDF Metadata Online — Inspect Hidden Author, Title & Software Tags',
    metaDescription: 'Inspect hidden metadata in PDF documents online. View title, author, subject, creation date, producer software, and modification stamps for free.',
    shortDescription: 'Inspect hidden metadata including author, title, creation date, and software tags.',
    intro: 'PDF documents quietly store extensive metadata dictionaries detailing the author name, software producer, creation timestamps, and modifying applications. Before sharing documents with adversaries, competitors, or clients, it is smart practice to inspect what hidden information is stored inside. Our PDF Metadata Viewer reads and displays this information clearly in your browser.',
    howItWorks: [
      'Drop your PDF file into the metadata inspection panel.',
      'Our engine reads the document information dictionary and XMP metadata trees.',
      'Review all metadata properties including author, creator, creation date, and title.'
    ],
    features: [
      'Inspects title, author, subject, keywords, producer, creator, and timestamps.',
      'Reveals hidden software footprints and editing trails embedded in files.',
      'Local client-side parsing ensures confidential metadata remains entirely private.',
      'Works instantly without registration, installations, or waiting queues.'
    ],
    faqs: [
      {
        question: 'What metadata fields are commonly found inside a PDF?',
        answer: 'Common fields include Document Title, Author Name, Subject, Keywords, Creator Software, Producer Application, Creation Date, and Modification Date.'
      },
      {
        question: 'Can viewing metadata leak my document to search engines?',
        answer: 'No. The file is never uploaded anywhere. It is parsed purely inside your browser memory.'
      },
      {
        question: 'How can I wipe this metadata before sharing my file?',
        answer: 'You can use our companion tool, Remove PDF Metadata, to strip all hidden fields with a single click.'
      },
      {
        question: 'Does this tool work on scanned documents?',
        answer: 'Yes, any valid PDF file containing standard header dictionaries can be inspected.'
      },
      {
        question: 'Is there any fee or limitation for inspecting files?',
        answer: 'No, this tool is 100% free with unlimited usage.'
      }
    ],
    relatedSlugs: ['pdf-metadata-remover', 'protect-pdf', 'pdf-preview', 'organize-pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF document (.pdf)',
    allowMultiple: false,
    outputFilename: 'metadata-report.txt',
    outputExtension: 'txt',
    iconName: 'FileSearch'
  },
  {
    slug: 'pdf-metadata-remover',
    name: 'Remove PDF Metadata',
    tier: 3,
    priorityStars: '★★☆☆☆',
    category: 'utility',
    categoryLabel: 'PDF Utilities',
    actionTitle: 'Remove PDF Metadata Online — Strip Hidden Author, Date & Software Traces',
    metaDescription: 'Sanitize and clean hidden metadata from PDF files online. Wipe author names, creation timestamps, and software tags to protect your privacy.',
    shortDescription: 'Sanitize your PDF by stripping out author names, timestamps, and software traces.',
    intro: 'Sharing PDF documents without sanitizing their metadata can inadvertently leak your username, company computer names, software versions, and edit history to recipients. Our Remove PDF Metadata tool scrubs the document info dictionary and XMP metadata trees completely, generating a clean, sanitized PDF that protects your personal and corporate privacy.',
    howItWorks: [
      'Upload your PDF to the metadata sanitizer.',
      'Our engine locates and strips all document information dictionaries and metadata streams.',
      'Download your sanitized PDF file with all sensitive tracking tags erased.'
    ],
    features: [
      'Erases author, creator, producer, creation timestamps, and custom dictionary entries.',
      'Prevents inadvertent leakage of user identities and internal IT software versions.',
      'Reconstructs the PDF structure cleanly without altering text, graphics, or layout.',
      'Completely client-side execution ensures your documents stay confidential.'
    ],
    faqs: [
      {
        question: 'Why should I remove metadata before sharing a PDF?',
        answer: 'Metadata can expose sensitive personal details like the author name, editing software, corporate network paths, and timestamps.'
      },
      {
        question: 'Will scrubbing metadata affect the visible text or images in my file?',
        answer: 'Not at all. Only the hidden metadata properties are erased; every visible page element remains completely intact.'
      },
      {
        question: 'Can I verify that the metadata is truly gone?',
        answer: 'Yes. You can immediately inspect the cleaned file using our View PDF Metadata tool to confirm the fields are blank.'
      },
      {
        question: 'Are my files sent to your servers for cleaning?',
        answer: 'No. The sanitization runs entirely in your browser using client-side JavaScript.'
      },
      {
        question: 'Is this sanitization service completely free?',
        answer: 'Yes, 100% free with no limits, no watermarks, and no signups.'
      }
    ],
    relatedSlugs: ['pdf-metadata-viewer', 'protect-pdf', 'compress-pdf', 'organize-pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF to sanitize (.pdf)',
    allowMultiple: false,
    outputFilename: 'sanitized-document.pdf',
    outputExtension: 'pdf',
    iconName: 'FileX'
  },
  {
    slug: 'organize-pdf',
    name: 'Reorder PDF Pages',
    tier: 3,
    priorityStars: '★★☆☆☆',
    category: 'utility',
    categoryLabel: 'PDF Utilities',
    actionTitle: 'Organize PDF Pages Online — Reorder and Rearrange PDF Pages Free',
    metaDescription: 'Reorder and rearrange pages in your PDF file online. Reorganize page sequences easily directly in your browser with 100% privacy and zero uploads.',
    shortDescription: 'Rearrange and reorder pages in your PDF document to match your ideal sequence.',
    intro: 'Putting together pitch decks, portfolio presentations, or compiled case files often requires adjusting the sequence of pages. Our Organize PDF tool allows you to specify a custom page order (e.g., reversing pages or placing appendices earlier) and instantly rebuilds your PDF into the exact arrangement you need, all within your browser tab.',
    howItWorks: [
      'Upload your PDF to the page organizer workspace.',
      'Specify your custom page order sequence (e.g. "3, 1, 2, 4").',
      'Click "Organize PDF" to download your newly arranged document.'
    ],
    features: [
      'Simple page sequence reordering to organize documents exactly as needed.',
      'Preserves original vector elements, bookmarks, hyperlinks, and visual fidelity.',
      'Local execution ensures confidential legal files and briefs stay 100% private.',
      'Instant client-side rebuilding with zero waiting queues or subscription barriers.'
    ],
    faqs: [
      {
        question: 'How do I specify the new page order?',
        answer: 'Enter the desired page order as comma-separated numbers (for example, "3, 1, 2, 4") in the order field.'
      },
      {
        question: 'Can I repeat a page multiple times in the reordered output?',
        answer: 'Yes! You can duplicate pages in the sequence if needed (e.g., "1, 2, 1, 3").'
      },
      {
        question: 'Will reordering pages harm the document formatting?',
        answer: 'No. Page trees and vector graphics are safely re-linked without re-compressing assets.'
      },
      {
        question: 'Are my files uploaded to any external server?',
        answer: 'No. Everything is calculated in memory inside your browser. No files leave your device.'
      },
      {
        question: 'Is there a limit on how many pages can be organized?',
        answer: 'No arbitrary limits are imposed. The operation is limited only by your browser tab memory.'
      }
    ],
    relatedSlugs: ['rotate-pdf', 'split-pdf', 'merge-pdf', 'delete-pdf-pages'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF document (.pdf)',
    allowMultiple: false,
    outputFilename: 'reordered-document.pdf',
    outputExtension: 'pdf',
    iconName: 'ListOrdered'
  },
  {
    slug: 'pdf-thumbnail-generator',
    name: 'Generate PDF Thumbnails',
    tier: 3,
    priorityStars: '★★☆☆☆',
    category: 'utility',
    categoryLabel: 'PDF Utilities',
    actionTitle: 'Generate PDF Thumbnails Online — Create High-Res Cover & Page Previews',
    metaDescription: 'Generate crisp image thumbnails and cover previews from your PDF files online. Perfect for websites, catalogs, and file galleries with zero uploads.',
    shortDescription: 'Create clean, high-resolution thumbnail images of your PDF pages.',
    intro: 'Publishing documents on digital library websites, eCommerce portals, or internal company wikis usually requires cover thumbnails and visual previews. Our PDF Thumbnail Generator renders your PDF pages into compact, high-resolution thumbnail images ready for immediate download and web publication.',
    howItWorks: [
      'Upload your PDF document to the thumbnail generator.',
      'Our engine renders page snapshots onto an optimized graphics canvas.',
      'Download your generated cover and page thumbnails as crisp PNG images.'
    ],
    features: [
      'Generates sharp cover thumbnails and page snapshots ready for web integration.',
      'Optimized image dimensions suitable for file galleries, eCommerce, and archives.',
      'Client-side rendering keeps proprietary catalog previews strictly private.',
      'Free, instantaneous image generation with zero watermarks or registration.'
    ],
    faqs: [
      {
        question: 'What format are the generated thumbnails saved in?',
        answer: 'Thumbnails are exported as standard high-resolution PNG images, ideal for web use.'
      },
      {
        question: 'Can I generate thumbnails for all pages or just the first page?',
        answer: 'You can generate a thumbnail of the cover page or export thumbnails across document pages.'
      },
      {
        question: 'Are my document previews sent to any external server?',
        answer: 'No. Rendering occurs purely inside your browser memory using HTML5 canvas.'
      },
      {
        question: 'Can I use the thumbnails on my website or online store?',
        answer: 'Yes, the exported images are standard web assets that you can host anywhere without restriction.'
      },
      {
        question: 'Is there a fee for creating thumbnails?',
        answer: 'No, this tool is 100% free with unlimited usage.'
      }
    ],
    relatedSlugs: ['pdf-preview', 'pdf-to-png', 'pdf-to-jpg', 'extract-pdf-pages'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF document (.pdf)',
    allowMultiple: false,
    outputFilename: 'pdf-thumbnail.png',
    outputExtension: 'png',
    iconName: 'LayoutGrid'
  },
  {
    slug: 'pdf-preview',
    name: 'Preview PDF Online',
    tier: 3,
    priorityStars: '★★☆☆☆',
    category: 'utility',
    categoryLabel: 'PDF Utilities',
    actionTitle: 'Preview PDF Online — Fast In-Browser PDF Document Viewer',
    metaDescription: 'Preview and inspect PDF documents online without installing software. View pages, check page counts, and inspect layouts directly in your browser privately.',
    shortDescription: 'Inspect and read PDF documents directly in your browser without software installs.',
    intro: 'Need to review a PDF on a device without a native PDF viewer, or want to inspect a file safely without risking malicious macros? Our online PDF Preview tool renders your document inside an interactive viewer in your browser, allowing you to scroll through pages, inspect layouts, and verify text with complete security and zero downloads.',
    howItWorks: [
      'Select or drop any PDF document into the viewer pane.',
      'The in-browser engine loads and renders each page with smooth navigation controls.',
      'Scroll, zoom, and inspect your document pages securely in real time.'
    ],
    features: [
      'Full in-browser rendering with page navigation, zoom, and crisp font displays.',
      'Zero installation required: works instantly on any desktop, laptop, or mobile browser.',
      'Completely isolated client-side sandbox protects against malware and tracking.',
      'Instant viewing with zero file uploads, zero registration, and zero ads.'
    ],
    faqs: [
      {
        question: 'Do I need Adobe Acrobat or any plugin installed to preview files?',
        answer: 'No. Our viewer runs on modern browser canvas technology and requires no external plugins or software.'
      },
      {
        question: 'Is it safe to preview unfamiliar PDFs with this tool?',
        answer: 'Yes. Because the document is processed within the browser sandbox without executing executable code, it is very safe.'
      },
      {
        question: 'Can I zoom in to examine small fine-print text?',
        answer: 'Yes, the previewer allows zooming in and out with high-resolution vector rendering.'
      },
      {
        question: 'Does the previewer upload my files to the internet?',
        answer: 'No. The file is read directly from your local disk into browser memory. No data is transmitted.'
      },
      {
        question: 'Does this viewer support multi-page books and manuals?',
        answer: 'Yes, documents of any page length can be smoothly navigated.'
      }
    ],
    relatedSlugs: ['pdf-thumbnail-generator', 'pdf-to-jpg', 'merge-pdf', 'split-pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select a PDF to preview (.pdf)',
    allowMultiple: false,
    outputFilename: 'preview-report.txt',
    outputExtension: 'txt',
    iconName: 'Eye'
  },
  {
    slug: 'fill-pdf-forms',
    name: 'Fill PDF Forms Online',
    tier: 3,
    priorityStars: '★★☆☆☆',
    category: 'utility',
    categoryLabel: 'PDF Utilities',
    actionTitle: 'Fill PDF Forms Online — Complete Interactive Form Fields Free in Browser',
    metaDescription: 'Fill out interactive PDF forms and text fields online for free. Complete applications, tax forms, and questionnaires directly in your browser with zero uploads.',
    shortDescription: 'Fill interactive PDF forms, text inputs, and checkboxes directly in your browser.',
    intro: 'Completing interactive government forms, job applications, and medical questionnaires often requires expensive desktop software. Our Fill PDF Forms tool detects interactive AcroForm fields within your document, lets you input your details and toggle checkboxes directly in your browser, and flattens your answers into a finalized, ready-to-submit PDF.',
    howItWorks: [
      'Upload your interactive form PDF into the form filler.',
      'Type your information into the detected text fields and toggle checkboxes.',
      'Click "Save Filled PDF" to download your completed, professional document.'
    ],
    features: [
      'Detects standard interactive AcroForm text fields, checkboxes, and radio buttons.',
      'Flattens completed entries so answers cannot be accidentally modified or erased.',
      'Client-side processing guarantees your social security numbers and personal data stay private.',
      'Free, instant form completion with zero subscription traps or hidden fees.'
    ],
    faqs: [
      {
        question: 'What types of PDF form fields are supported?',
        answer: 'The tool supports standard interactive AcroForm text inputs, checkboxes, and option fields.'
      },
      {
        question: 'Will my confidential personal data be uploaded to a server?',
        answer: 'Never. Your form entries and document data are processed strictly in your local browser session.'
      },
      {
        question: 'Can I flatten the form so that answers become permanent?',
        answer: 'Yes, the tool flattens filled fields so the output document displays consistently across all viewers.'
      },
      {
        question: 'Can I sign the form after filling it out?',
        answer: 'Yes, you can easily use our companion Sign PDF Online tool to add your handwritten signature.'
      },
      {
        question: 'Is there any limit on how many forms I can fill for free?',
        answer: 'No limits exist. You can fill as many forms as you need completely free.'
      }
    ],
    relatedSlugs: ['sign-pdf', 'protect-pdf', 'compress-pdf', 'merge-pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    acceptDescription: 'Select an interactive PDF form (.pdf)',
    allowMultiple: false,
    outputFilename: 'filled-form.pdf',
    outputExtension: 'pdf',
    iconName: 'FileEdit'
  }
];

export const TOOL_CATEGORIES = [
  { id: 'core', label: 'Core PDF Tools', description: 'Essential operations for merging, splitting, compressing, and managing page layouts.' },
  { id: 'convert', label: 'Convert PDF', description: 'Seamless bidirectional conversion between PDFs, images, spreadsheets, and Office documents.' },
  { id: 'utility', label: 'PDF Utilities', description: 'Advanced security, digital signatures, metadata inspection, and form tools.' }
] as const;

export function getToolBySlug(slug: string): ToolItem | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getTier1Tools(): ToolItem[] {
  return TOOLS.filter((t) => t.tier === 1);
}

export function getToolsByCategory(category: 'core' | 'convert' | 'utility'): ToolItem[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getRelatedTools(tool: ToolItem): ToolItem[] {
  return tool.relatedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolItem => Boolean(t));
}
