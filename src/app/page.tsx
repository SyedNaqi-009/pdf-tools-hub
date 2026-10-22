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
  Sparkles,
  FileText,
  FileCheck2,
  CheckCircle2,
  Check,
  X,
  Sliders,
  FolderGit2,
  Minimize2,
  FileCode,
  Shield,
  ArrowUpRight,
  Languages,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import ToolCard from '@/components/tools/ToolCard';
import BlogCard from '@/components/blog/BlogCard';
import FAQAccordion from '@/components/ui/FAQAccordion';
import { getTier1Tools, TOOLS, TOOL_CATEGORIES } from '@/lib/tools-data';
import { getAllBlogPosts } from '@/lib/blog';
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
    question: 'Is dopdf safe for strictly confidential business, financial, and legal files?',
    answer:
      'Yes, absolutely. Because zero network requests transfer your document payload, there is zero risk of remote data interception, server breaches, or unconsented cloud training. Legal agreements, IRS tax filings, bank statements, and sensitive healthcare records remain 100% within your local browser security sandbox.',
  },
  {
    question: 'Are there hidden charges, quotas, watermarks, or subscription paywalls?',
    answer:
      'No. All 27 tools across dopdf are completely free with zero restrictions. We do not brand your pages with watermark stamps, restrict how many documents you can process per day, or require credit cards or account signups.',
  },
  {
    question: 'What is the maximum document size supported?',
    answer:
      'We do not enforce artificial cloud file-size restrictions. Because operations execute in local device RAM, you can process documents as large as your device memory comfortably permits (typically several hundred megabytes on modern smartphones, laptops, and workstations).',
  },
  {
    question: 'Which file formats and conversions are supported?',
    answer:
      'Our suite features bidirectional conversions across PDF, Microsoft Word (.docx), Microsoft Excel (.xlsx), Microsoft PowerPoint (.pptx), JPG, JPEG, and PNG formats, alongside specialized utilities for multilingual PDF translation, cryptographic password protection, digital signatures, and metadata scrubbing.',
  },
  {
    question: 'Does dopdf work on mobile devices and tablets without an app?',
    answer:
      'Yes. Our responsive WebAssembly interface runs smoothly in Safari on iOS/iPadOS, Chrome on Android, and all modern mobile and desktop web browsers without requiring any App Store downloads.',
  },
];

export default function HomePage() {
  const tier1Tools = getTier1Tools();
  const latestPosts = getAllBlogPosts().slice(0, 3);
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
        <section className="relative overflow-hidden border-b border-zinc-900 bg-zinc-950 text-white py-16 sm:py-24 lg:py-28">
          <div className="absolute inset-0 bg-studio-grid opacity-25 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          <Container className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              
              {/* Left Column: Command Statement & Direct Action */}
              <div className="lg:col-span-7 space-y-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-900/60 bg-rose-950/40 px-3.5 py-1.5 text-xs font-mono font-bold text-rose-400">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>FREE ONLINE PDF TOOLS // CLIENT-SIDE PRIVACY</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                  Free PDF Converter Online
                </h1>

                <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
                  Convert PDF files online with easy-to-use tools for supported formats. Explore PDF converters and useful PDF utilities in one convenient place.
                </p>

                {/* Direct Action Deck */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/tools/pdf-to-word"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-7 py-4 text-sm sm:text-base font-black text-white shadow-xl shadow-rose-950/40 hover:bg-rose-500 hover:shadow-2xl transition-all active:scale-98 uppercase tracking-wider"
                  >
                    <span>Start Converting</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <Link
                    href="/tools"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-6 py-4 text-xs sm:text-sm font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <span>Explore All PDF Tools</span>
                  </Link>
                </div>

                {/* Popular PDF Converters Shortcuts */}
                <div className="pt-4 border-t border-zinc-900/80">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-2.5">
                    Popular PDF Converters:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {popularConverters.map((pill) => (
                      <Link
                        key={pill.slug}
                        href={`/tools/${pill.slug}`}
                        className="rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-rose-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                      >
                        {pill.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: In-Browser Security & Quick Access Deck */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-7 shadow-2xl ring-1 ring-white/10 space-y-6">
                  
                  {/* Console Header */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-rose-500" />
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="font-mono text-[11px] text-zinc-400">dopdf // ENGINE v2.4</span>
                  </div>

                  {/* Telemetry Readouts */}
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                      <span className="text-zinc-400 flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-rose-400" /> Execution Core
                      </span>
                      <span className="text-emerald-400 font-bold">100% In-Browser RAM</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                      <span className="text-zinc-400 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-400" /> Network Upload
                      </span>
                      <span className="text-zinc-200 font-bold">0.00 KB (Zero Logs)</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                      <span className="text-zinc-400 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-amber-400" /> Cryptography
                      </span>
                      <span className="text-zinc-200 font-bold">AES-256 WebCrypto</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                      <span className="text-zinc-400 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-rose-400" /> Latency / Queue
                      </span>
                      <span className="text-rose-400 font-bold">&lt; 0.04s (Instant)</span>
                    </div>
                  </div>

                  {/* Explore All PDF Tools Card */}
                  <Link
                    href="/tools"
                    className="block group rounded-2xl border-2 border-dashed border-zinc-700 hover:border-rose-500 bg-zinc-950/50 p-5 text-center transition-all"
                  >
                    <p className="text-sm font-bold text-zinc-200 group-hover:text-rose-400 transition-colors">
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
            SECTION 2: REAL-TIME HARDWARE METRIC BAR
        ========================================================================= */}
        <section className="border-b border-zinc-200 bg-white py-8">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-100">
              <div className="pt-3 md:pt-0">
                <p className="text-3xl sm:text-4xl font-black text-zinc-950 font-mono">27</p>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mt-1 font-mono">
                  Client Utilities
                </p>
              </div>

              <div className="pt-3 md:pt-0">
                <p className="text-3xl sm:text-4xl font-black text-rose-600 font-mono">0 KB</p>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mt-1 font-mono">
                  Cloud Data Egress
                </p>
              </div>

              <div className="pt-3 md:pt-0">
                <p className="text-3xl sm:text-4xl font-black text-zinc-950 font-mono">&lt; 0.05s</p>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mt-1 font-mono">
                  Hardware Latency
                </p>
              </div>

              <div className="pt-3 md:pt-0">
                <p className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono">100%</p>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mt-1 font-mono">
                  Free & Private
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* =========================================================================
            SECTION 3: POPULAR CONVERTERS MATRIX
        ========================================================================= */}
        <section id="popular" className="py-16 sm:py-24 bg-zinc-50 border-b border-zinc-200 scroll-mt-20">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
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
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider"
              >
                <span>Browse All 27 Tools Directory</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Highlight Card 1: PDF to Word */}
              <Link
                href="/tools/pdf-to-word"
                className="group md:col-span-2 lg:col-span-2 relative rounded-3xl border border-zinc-200 bg-white p-7 sm:p-9 shadow-xs hover:border-zinc-900 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white group-hover:bg-rose-600 transition-colors">
                      <FileText className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      ★ TOP CONVERSION ENGINE
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-zinc-950 group-hover:text-rose-600 transition-colors">
                    Convert PDF to Word (.docx)
                  </h3>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed max-w-xl">
                    Extract paragraphs, typography, and structural content into fully editable Microsoft Word documents directly in your browser. Fast, accurate, and completely confidential.
                  </p>

                  {/* Simulated Workflow Badges */}
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono bg-zinc-100 text-zinc-700 px-3 py-1 rounded-lg border border-zinc-200">
                      document.pdf
                    </span>
                    <span className="text-zinc-400 font-bold">→</span>
                    <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200 font-bold">
                      editable-document.docx
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-500 group-hover:text-zinc-950">
                  <span className="font-mono">PRESERVES TEXT & LAYOUT</span>
                  <span className="inline-flex items-center gap-1 text-rose-600">
                    Open PDF to Word <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              {/* Highlight Card 2: PDF Language Converter */}
              <Link
                href="/tools/translate-pdf"
                className="group relative rounded-3xl border border-zinc-200 bg-white p-7 sm:p-9 shadow-xs hover:border-zinc-900 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white group-hover:bg-rose-600 transition-colors">
                      <Languages className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      50+ LANGUAGES
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-zinc-950 group-hover:text-rose-600 transition-colors">
                    Translate PDF
                  </h3>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                    Translate entire PDF documents across languages while preserving structure and generating clean PDF outputs.
                  </p>

                  <div className="mt-6 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono flex items-center justify-between">
                    <span className="text-zinc-400">English PDF</span>
                    <span className="font-bold text-rose-600 font-sans">Multi-lingual AI</span>
                    <span className="text-emerald-600 font-bold">Spanish, French...</span>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-500 group-hover:text-zinc-950">
                  <span className="font-mono">NEURAL TRANSLATION</span>
                  <span className="inline-flex items-center gap-1 text-rose-600">
                    Translate Now <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              {/* Complementary Tools Grid */}
              {tier1Tools.map((tool) => {
                if (tool.slug === 'pdf-to-word' || tool.slug === 'translate-pdf') return null;
                return <ToolCard key={tool.slug} tool={tool} />;
              })}
            </div>
          </Container>
        </section>

        {/* =========================================================================
            SECTION 4: COMPLETE DIRECTORY BY CATEGORY
        ========================================================================= */}
        <section className="py-16 sm:py-24 bg-white border-b border-zinc-200">
          <Container>
            <SectionHeading
              badge="FULL 27-MODULE CATALOG"
              title="All PDF Utilities by Category"
              subtitle="Every tool runs with 100% client-side memory safety, zero subscriptions, and complete confidentiality."
              centered
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              {TOOL_CATEGORIES.map((category, index) => {
                const catTools = TOOLS.filter((t) => t.category === category.id);
                return (
                  <div
                    key={category.id}
                    className="rounded-3xl border border-zinc-200 bg-zinc-50/60 p-7 space-y-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                        <div>
                          <span className="font-mono text-xs font-bold text-rose-600 uppercase">
                            SECTION 0{index + 1}
                          </span>
                          <h3 className="text-xl font-black text-zinc-950 mt-0.5">
                            {category.label}
                          </h3>
                        </div>
                        <span className="font-mono text-xs text-zinc-400 bg-white px-2.5 py-1 rounded-lg border border-zinc-200">
                          {catTools.length} Tools
                        </span>
                      </div>

                      <p className="text-xs text-zinc-500 mt-3 leading-relaxed">
                        {category.description}
                      </p>

                      <div className="mt-5 space-y-2">
                        {catTools.map((tool) => (
                          <ToolCard key={tool.slug} tool={tool} variant="compact" />
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-200/80">
                      <Link
                        href={`/tools#${category.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-700 hover:text-rose-600 uppercase"
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
            SECTION 5: ARCHITECTURAL COMPARISON: LOCAL WASM VS TRADITIONAL CLOUD SAAS
        ========================================================================= */}
        <section id="comparison" className="py-16 sm:py-24 bg-zinc-950 text-white border-b border-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-studio-grid opacity-15 pointer-events-none" />

          <Container className="relative">
            <SectionHeading
              badge="SECURITY BENCHMARK"
              title="Why Client-Side WASM Beats Cloud SaaS"
              subtitle="Understand the critical architectural differences between dopdf and traditional upload-based services like Smallpdf or iLovePDF."
              centered
              className="text-white [&_h2]:text-white [&_p]:text-zinc-400"
            />

            <div className="max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-900/90 overflow-hidden shadow-2xl mt-12">
              <div className="grid grid-cols-12 bg-zinc-950 p-4 sm:p-5 border-b border-zinc-800 text-xs font-mono font-bold text-zinc-400">
                <div className="col-span-5 sm:col-span-4 uppercase">Feature / Vector</div>
                <div className="col-span-4 sm:col-span-4 text-rose-400 uppercase">dopdf (Local)</div>
                <div className="col-span-3 sm:col-span-4 text-zinc-500 uppercase">Cloud SaaS Converters</div>
              </div>

              <div className="divide-y divide-zinc-800/80 text-xs sm:text-sm font-mono">
                {/* Row 1 */}
                <div className="grid grid-cols-12 p-4 sm:p-5 items-center">
                  <div className="col-span-5 sm:col-span-4 font-bold text-zinc-200">File Storage & Privacy</div>
                  <div className="col-span-4 sm:col-span-4 text-emerald-400 flex items-center gap-1.5 font-bold">
                    <Check className="h-4 w-4 shrink-0" /> Never leaves device RAM
                  </div>
                  <div className="col-span-3 sm:col-span-4 text-zinc-400 flex items-center gap-1.5">
                    <X className="h-4 w-4 text-rose-500 shrink-0" /> Uploaded to remote servers
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-12 p-4 sm:p-5 items-center">
                  <div className="col-span-5 sm:col-span-4 font-bold text-zinc-200">Execution Speed</div>
                  <div className="col-span-4 sm:col-span-4 text-emerald-400 flex items-center gap-1.5 font-bold">
                    <Check className="h-4 w-4 shrink-0" /> Instant local CPU / WASM
                  </div>
                  <div className="col-span-3 sm:col-span-4 text-zinc-400 flex items-center gap-1.5">
                    <X className="h-4 w-4 text-rose-500 shrink-0" /> Upload + queue wait delays
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-12 p-4 sm:p-5 items-center">
                  <div className="col-span-5 sm:col-span-4 font-bold text-zinc-200">Data Breach Exposure</div>
                  <div className="col-span-4 sm:col-span-4 text-emerald-400 flex items-center gap-1.5 font-bold">
                    <Check className="h-4 w-4 shrink-0" /> Mathematically Zero
                  </div>
                  <div className="col-span-3 sm:col-span-4 text-zinc-400 flex items-center gap-1.5">
                    <X className="h-4 w-4 text-rose-500 shrink-0" /> Vulnerable to cloud hacks
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-12 p-4 sm:p-5 items-center">
                  <div className="col-span-5 sm:col-span-4 font-bold text-zinc-200">Usage Cost & Watermarks</div>
                  <div className="col-span-4 sm:col-span-4 text-emerald-400 flex items-center gap-1.5 font-bold">
                    <Check className="h-4 w-4 shrink-0" /> 100% Free, No Watermarks
                  </div>
                  <div className="col-span-3 sm:col-span-4 text-zinc-400 flex items-center gap-1.5">
                    <X className="h-4 w-4 text-rose-500 shrink-0" /> Paid subscriptions & limits
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* =========================================================================
            SECTION 6: LATEST EDITORIAL GUIDES (BLOG)
        ========================================================================= */}
        <section className="py-16 sm:py-24 bg-zinc-50 border-b border-zinc-200">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <SectionHeading
                  badge="KNOWLEDGE REPOSITORY"
                  title="PDF Guides & Format Documentation"
                  subtitle="In-depth tutorials, file format specifications, and document workflows."
                  className="mb-0"
                />
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider"
              >
                <span>Read All 15 Articles</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </Container>
        </section>

        {/* =========================================================================
            SECTION 7: FREQUENTLY ASKED QUESTIONS
        ========================================================================= */}
        <section className="py-16 sm:py-24 bg-white border-b border-zinc-200">
          <Container>
            <SectionHeading
              badge="TRANSPARENCY & ASSURANCE"
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about our browser-powered, privacy-first PDF platform."
              centered
            />

            <div className="max-w-3xl mx-auto">
              <FAQAccordion items={HOME_FAQS} />
            </div>
          </Container>
        </section>

        {/* =========================================================================
            SECTION 8: PRE-FOOTER COMMAND CTA
        ========================================================================= */}
        <section className="py-16 sm:py-20 bg-zinc-900 text-white">
          <Container>
            <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900 p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-6 shadow-2xl">
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-rose-950 text-rose-400 border border-rose-900/60 uppercase">
                INSTANT BROWSER ACCESS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Ready to Process Documents with Complete Privacy?
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Choose any of our 27 specialized tools. No downloads, no subscriptions, and zero file uploads.
              </p>
              <div className="pt-2">
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-8 py-4 text-sm sm:text-base font-black text-white shadow-xl shadow-rose-950/40 hover:bg-rose-500 transition-all active:scale-98 uppercase tracking-wider"
                >
                  <span>Explore All PDF Tools</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </Container>
        </section>

      </main>
    </>
  );
}
