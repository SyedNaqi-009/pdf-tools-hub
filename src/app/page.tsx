import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  Layers,
  FileText,
  Shield,
  ArrowUpRight,
  Languages,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import ToolCard from '@/components/tools/ToolCard';
import FAQAccordion from '@/components/ui/FAQAccordion';
import { getTier1Tools, TOOLS, TOOL_CATEGORIES } from '@/lib/tools-data';
import { getHomeStructuredData, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Free PDF Converter Online | dopdf',
  description:
    'Convert PDF files online with easy-to-use tools for supported formats. Explore PDF converters and useful PDF utilities in one convenient place.',
  alternates: {
    canonical: SITE_URL,
  },
};

const HOME_FAQS = [
  {
    question: 'How do dopdf tools work without uploading my files to any server?',
    answer:
      'Unlike legacy cloud converters that transmit your private files to remote servers, dopdf runs compiled WebAssembly (WASM) and client-side JavaScript directly within your browser’s V8/JavaScriptCore engine. Your documents are read into local device RAM, manipulated via cryptographic and binary stream APIs, and saved back to your storage without emitting a single byte over the public internet.',
  },
  {
    question: 'Is dopdf safe for confidential business, financial, and legal files?',
    answer:
      'Yes, absolutely. Because zero network requests transfer your document payload, there is zero risk of remote data interception, server breaches, or unconsented cloud training. Legal agreements, tax filings, bank statements, and sensitive healthcare records remain 100% within your local browser security sandbox.',
  },
  {
    question: 'Are there hidden charges, quotas, watermarks, or subscription paywalls?',
    answer:
      'No. All 27 tools across dopdf are completely free with zero restrictions. We do not brand your pages with watermark stamps, restrict how many documents you can process per day, or require credit cards or account signups.',
  },
  {
    question: 'Which file formats and conversions are supported?',
    answer:
      'Our suite features bidirectional conversions across PDF, Microsoft Word (.docx), Microsoft Excel (.xlsx), Microsoft PowerPoint (.pptx), JPG, JPEG, and PNG formats, alongside specialized utilities for multilingual PDF translation, cryptographic password protection, digital signatures, and metadata scrubbing.',
  },
  {
    question: 'Does dopdf work on mobile devices and tablets without an app?',
    answer:
      'Yes. Our responsive interface runs smoothly in Safari on iOS/iPadOS, Chrome on Android, and all modern mobile and desktop web browsers without requiring any App Store downloads.',
  },
];

export default function HomePage() {
  const tier1Tools = getTier1Tools();
  const [websiteSchema, orgSchema] = getHomeStructuredData();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const popularConverters = [
    { name: 'PDF to Word', slug: 'pdf-to-word' },
    { name: 'Word to PDF', slug: 'word-to-pdf' },
    { name: 'Translate PDF', slug: 'translate-pdf' },
    { name: 'PDF to JPG', slug: 'pdf-to-jpg' },
    { name: 'JPG to PDF', slug: 'jpg-to-pdf' },
    { name: 'PDF to Excel', slug: 'pdf-to-excel' },
    { name: 'Merge PDF', slug: 'merge-pdf' },
    { name: 'Compress PDF', slug: 'compress-pdf' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-zinc-50">
        
        {/* =========================================================================
            SECTION 1: HERO SECTION
        ========================================================================= */}
        <section className="relative overflow-hidden border-b border-zinc-900 bg-zinc-950 text-white py-14 sm:py-20">
          <div className="absolute inset-0 bg-studio-grid opacity-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <Container className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: Command Statement & Direct Action */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-900/60 bg-blue-950/40 px-3.5 py-1.5 text-xs font-mono font-bold text-blue-400">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>FREE ONLINE PDF TOOLS // ZERO FILE UPLOADS</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                  Free PDF Converter Online
                </h1>

                <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
                  Convert PDF files online with easy-to-use tools for supported formats. Explore PDF converters and useful PDF utilities in one convenient place.
                </p>

                {/* Direct Action Deck */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                  <Link
                    href="/tools/pdf-to-word"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm sm:text-base font-black text-white shadow-xl shadow-blue-950/40 hover:bg-blue-500 hover:shadow-2xl transition-all active:scale-98 uppercase tracking-wider"
                  >
                    <span>Start Converting</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <Link
                    href="/tools"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-6 py-3.5 text-xs sm:text-sm font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <span>Explore All 27 Tools</span>
                  </Link>
                </div>

                {/* Popular PDF Converters Shortcuts */}
                <div className="pt-3 border-t border-zinc-900/80">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                    Popular PDF Converters:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {popularConverters.map((pill) => (
                      <Link
                        key={pill.slug}
                        href={`/tools/${pill.slug}`}
                        className="rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-blue-500 hover:text-blue-400 hover:bg-zinc-800 transition-colors"
                      >
                        {pill.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: In-Browser Security & Quick Access Deck */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl ring-1 ring-white/10 space-y-5">
                  
                  {/* Console Header */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <img src="/icon.png" alt="DoPDF" className="h-7 w-7 object-contain drop-shadow-sm" />
                      <span className="font-bold text-sm text-white">Do<span className="text-blue-500">PDF</span></span>
                    </div>
                    <span className="font-mono text-[11px] text-zinc-400">ENGINE v2.4 // READY</span>
                  </div>

                  {/* Telemetry Readouts */}
                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                      <span className="text-zinc-400 flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-blue-400" /> Execution Core
                      </span>
                      <span className="text-emerald-400 font-bold">100% In-Browser RAM</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                      <span className="text-zinc-400 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-400" /> Network Upload
                      </span>
                      <span className="text-zinc-200 font-bold">0.00 KB (Zero Logs)</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                      <span className="text-zinc-400 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-amber-400" /> Cryptography
                      </span>
                      <span className="text-zinc-200 font-bold">AES-256 WebCrypto</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                      <span className="text-zinc-400 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-400" /> Latency / Queue
                      </span>
                      <span className="text-blue-400 font-bold">&lt; 0.04s (Instant)</span>
                    </div>
                  </div>

                  {/* Quick Drop Callout */}
                  <Link
                    href="/tools"
                    className="block group rounded-2xl border-2 border-dashed border-zinc-700 hover:border-blue-500 bg-zinc-950/50 p-4 text-center transition-all"
                  >
                    <p className="text-sm font-bold text-zinc-200 group-hover:text-blue-400 transition-colors">
                      Explore All PDF Tools (27 Tools) →
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Discover the right PDF tool for your task, all in one place.
                    </p>
                  </Link>
                </div>
              </div>

            </div>
          </Container>
        </section>

        {/* =========================================================================
            SECTION 2: POPULAR CONVERTERS MATRIX
        ========================================================================= */}
        <section id="popular" className="py-14 sm:py-20 bg-zinc-50 border-b border-zinc-200 scroll-mt-20">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <SectionHeading
                  badge="POPULAR CONVERTERS"
                  title="Featured PDF Conversion Tools"
                  subtitle="Convert documents quickly and securely with high-precision browser-based conversion engines."
                  className="mb-0"
                />
              </div>
              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
              >
                <span>Browse All 27 Tools</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Highlight Card 1: PDF to Word */}
              <Link
                href="/tools/pdf-to-word"
                className="group md:col-span-2 lg:col-span-2 relative rounded-3xl border border-zinc-200 bg-white p-7 sm:p-8 shadow-xs hover:border-blue-600 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white group-hover:bg-blue-600 transition-colors">
                      <FileText className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      ★ TOP CONVERSION ENGINE
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-zinc-950 group-hover:text-blue-600 transition-colors">
                    Convert PDF to Word (.docx)
                  </h3>
                  <p className="mt-2.5 text-sm text-zinc-600 leading-relaxed max-w-xl">
                    Extract paragraphs, typography, and structural content into fully editable Microsoft Word documents directly in your browser. Fast, accurate, and completely confidential.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono bg-zinc-100 text-zinc-700 px-3 py-1 rounded-lg border border-zinc-200">
                      document.pdf
                    </span>
                    <span className="text-zinc-400 font-bold">→</span>
                    <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200 font-bold">
                      editable-document.docx
                    </span>
                  </div>
                </div>

                <div className="mt-7 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-500 group-hover:text-zinc-950">
                  <span className="font-mono">PRESERVES TEXT & LAYOUT</span>
                  <span className="inline-flex items-center gap-1 text-blue-600">
                    Open PDF to Word <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              {/* Highlight Card 2: PDF Language Converter */}
              <Link
                href="/tools/translate-pdf"
                className="group relative rounded-3xl border border-zinc-200 bg-white p-7 sm:p-8 shadow-xs hover:border-blue-600 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white group-hover:bg-blue-600 transition-colors">
                      <Languages className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      50+ LANGUAGES
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-zinc-950 group-hover:text-blue-600 transition-colors">
                    Translate PDF
                  </h3>
                  <p className="mt-2.5 text-sm text-zinc-600 leading-relaxed">
                    Translate entire PDF documents across languages while preserving structure and generating clean PDF outputs.
                  </p>

                  <div className="mt-5 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono flex items-center justify-between">
                    <span className="text-zinc-400">Source PDF</span>
                    <span className="font-bold text-blue-600 font-sans">Multi-lingual AI</span>
                    <span className="text-emerald-600 font-bold">50+ Languages</span>
                  </div>
                </div>

                <div className="mt-7 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-500 group-hover:text-zinc-950">
                  <span className="font-mono">NEURAL TRANSLATION</span>
                  <span className="inline-flex items-center gap-1 text-blue-600">
                    Translate Now <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              {/* Complementary Converters Grid */}
              {tier1Tools.map((tool) => {
                if (tool.slug === 'pdf-to-word' || tool.slug === 'translate-pdf') return null;
                return <ToolCard key={tool.slug} tool={tool} />;
              })}
            </div>
          </Container>
        </section>

        {/* =========================================================================
            SECTION 3: COMPLETE DIRECTORY BY CATEGORY
        ========================================================================= */}
        <section className="py-14 sm:py-20 bg-white border-b border-zinc-200">
          <Container>
            <SectionHeading
              badge="COMPLETE CATALOG"
              title="All 27 PDF Utilities by Category"
              subtitle="Every tool runs with 100% client-side memory safety, zero subscriptions, and complete confidentiality."
              centered
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-10">
              {TOOL_CATEGORIES.map((category, index) => {
                const catTools = TOOLS.filter((t) => t.category === category.id);
                return (
                  <div
                    key={category.id}
                    className="rounded-3xl border border-zinc-200 bg-zinc-50/60 p-6 sm:p-7 space-y-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-3.5">
                        <div>
                          <span className="font-mono text-xs font-bold text-blue-600 uppercase">
                            SECTION 0{index + 1}
                          </span>
                          <h3 className="text-xl font-black text-zinc-950 mt-0.5">
                            {category.label}
                          </h3>
                        </div>
                        <span className="font-mono text-xs text-zinc-500 bg-white px-2.5 py-1 rounded-lg border border-zinc-200">
                          {catTools.length} Tools
                        </span>
                      </div>

                      <p className="text-xs text-zinc-500 mt-2.5 leading-relaxed">
                        {category.description}
                      </p>

                      <div className="mt-4 space-y-2">
                        {catTools.map((tool) => (
                          <ToolCard key={tool.slug} tool={tool} variant="compact" />
                        ))}
                      </div>
                    </div>

                    <div className="pt-3.5 border-t border-zinc-200/80">
                      <Link
                        href={`/tools#${category.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-700 hover:text-blue-600 uppercase"
                      >
                        <span>Explore All {category.label}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* =========================================================================
            SECTION 4: FREQUENTLY ASKED QUESTIONS
        ========================================================================= */}
        <section className="py-14 sm:py-20 bg-zinc-50 border-b border-zinc-200">
          <Container>
            <SectionHeading
              badge="FAQS & ASSURANCE"
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about our browser-powered, privacy-first PDF platform."
              centered
            />

            <div className="max-w-3xl mx-auto mt-8">
              <FAQAccordion items={HOME_FAQS} />
            </div>
          </Container>
        </section>

      </main>
    </>
  );
}
