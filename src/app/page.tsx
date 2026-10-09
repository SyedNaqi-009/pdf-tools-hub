import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Smartphone,
  Lock,
  Layers,
  Sparkles,
  BookOpen,
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
  title: 'Free Online PDF Tools — No Upload Required | PDFToolsHub',
  description:
    'Merge, compress, convert, and edit PDFs directly in your browser. 100% private, client-side processing, zero server uploads, and completely free.',
  alternates: {
    canonical: SITE_URL,
  },
};

const HOME_FAQS = [
  {
    question: 'How do PDFToolsHub tools work without uploading my files?',
    answer:
      'Unlike traditional cloud converters, our application runs locally inside your browser using WebAssembly and modern client-side JavaScript APIs. When you select a document, it is read directly into your device RAM, processed locally, and saved back to your storage without transmitting any data over the internet.',
  },
  {
    question: 'Is PDFToolsHub safe for confidential business and legal documents?',
    answer:
      'Yes, 100%. Because zero files are uploaded to any server or external cloud storage, there is zero risk of data interception, data breaches, or unauthorized storage. Your proprietary contracts, tax returns, and medical records stay entirely under your control.',
  },
  {
    question: 'Are there any hidden costs, subscriptions, or watermarks?',
    answer:
      'No. All 26 tools on PDFToolsHub are completely free to use. We do not insert watermarks into your documents, limit how many files you can convert, or require credit cards or accounts.',
  },
  {
    question: 'Are there any file size limits?',
    answer:
      'We do not impose artificial file size quotas. Because processing occurs inside your browser memory, you can process documents as large as your device RAM can handle smoothly (typically up to several hundred megabytes on modern systems).',
  },
  {
    question: 'What document and image formats are supported?',
    answer:
      'Our suite supports PDF, Microsoft Word (.docx), Microsoft Excel (.xlsx), Microsoft PowerPoint (.pptx), JPG, JPEG, and PNG image formats with comprehensive bidirectional conversion capabilities.',
  },
  {
    question: 'Does PDFToolsHub work on mobile devices and tablets?',
    answer:
      'Yes. Our responsive web application runs smoothly in Safari on iOS/iPadOS, Chrome on Android, and all modern mobile web browsers without needing any App Store download.',
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

      <main className="min-h-screen">
        {/* Section 1: Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-200/80 bg-white py-16 sm:py-24 lg:py-28 bg-dot-pattern">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Copy & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 text-xs font-bold text-blue-700 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>100% Client-Side WebAssembly Processing</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                  Free Online PDF Tools — <span className="text-blue-600">No Upload</span> Required
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                  Merge, compress, convert, and edit PDFs directly in your browser. 100% private. 100% free. Your documents never leave your device.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                  <Link
                    href="/tools"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-98"
                  >
                    <span>Browse All 26 Tools</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <a
                    href="#popular"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span>Most Popular Tools</span>
                  </a>
                </div>

                {/* Trust Badges Bar */}
                <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> Zero Server Uploads
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-emerald-600" /> 100% Client-Side Privacy
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-emerald-600" /> No Wait Queues
                  </span>
                </div>
              </div>

              {/* Right Column: Abstract SVG Document Workflow Illustration */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md aspect-square rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 sm:p-8 shadow-lg flex items-center justify-center">
                  <svg
                    viewBox="0 0 400 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-md"
                    aria-label="Secure document workflow diagram"
                  >
                    {/* Background Central Ring */}
                    <circle cx="200" cy="200" r="140" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="6 6" />
                    <circle cx="200" cy="200" r="90" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="2" />

                    {/* Central Device Shield Node */}
                    <rect x="160" y="150" width="80" height="100" rx="10" fill="#2563EB" />
                    <path d="M180 180H220M180 200H220M180 220H205" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="200" cy="270" r="18" fill="#10B981" />
                    <path d="M194 270L198 274L206 266" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Surrounding Workflow Cards */}
                    {/* Top Node: Input PDF */}
                    <g className="transition-transform hover:scale-105">
                      <rect x="145" y="30" width="110" height="60" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                      <rect x="157" y="45" width="22" height="22" rx="4" fill="#FEE2E2" />
                      <text x="168" y="60" fill="#DC2626" fontSize="10" fontWeight="bold" textAnchor="middle">PDF</text>
                      <text x="190" y="55" fill="#0F172A" fontSize="11" fontWeight="bold">Input Files</text>
                      <text x="190" y="70" fill="#64748B" fontSize="9">Local Memory</text>
                    </g>

                    {/* Right Node: Convert & Merge */}
                    <g>
                      <rect x="270" y="170" width="110" height="60" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                      <rect x="282" y="185" width="22" height="22" rx="4" fill="#DBEAFE" />
                      <text x="293" y="200" fill="#2563EB" fontSize="10" fontWeight="bold" textAnchor="middle">DOC</text>
                      <text x="315" y="195" fill="#0F172A" fontSize="11" fontWeight="bold">Instant Convert</text>
                      <text x="315" y="210" fill="#64748B" fontSize="9">WebAssembly</text>
                    </g>

                    {/* Left Node: Compress & Optimize */}
                    <g>
                      <rect x="20" y="170" width="110" height="60" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                      <rect x="32" y="185" width="22" height="22" rx="4" fill="#FEF3C7" />
                      <text x="43" y="200" fill="#D97706" fontSize="9" fontWeight="bold" textAnchor="middle">OPT</text>
                      <text x="65" y="195" fill="#0F172A" fontSize="11" fontWeight="bold">Compression</text>
                      <text x="65" y="210" fill="#64748B" fontSize="9">Lossless Streams</text>
                    </g>

                    {/* Bottom Node: Instant Download */}
                    <g>
                      <rect x="145" y="310" width="110" height="60" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                      <rect x="157" y="325" width="22" height="22" rx="4" fill="#D1FAE5" />
                      <path d="M168 332V340M165 337L168 340L171 337" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="190" y="335" fill="#0F172A" fontSize="11" fontWeight="bold">Instant Save</text>
                      <text x="190" y="350" fill="#64748B" fontSize="9">Direct to Disk</text>
                    </g>

                    {/* Connection Arrows */}
                    <path d="M200 95V140" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                    <path d="M140 200H150" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                    <path d="M250 200H260" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                    <path d="M200 260V300" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Section 2: Most Popular Tools (Tier 1) */}
        <section id="popular" className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-200/80 scroll-mt-20">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
              <div>
                <SectionHeading
                  title="Most Popular PDF Tools"
                  subtitle="Our most searched and trusted utilities for rapid document workflows."
                  className="mb-0"
                />
              </div>
              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                <span>Browse All 26 Tools</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tier1Tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </Container>
        </section>

        {/* Section 3: All Tools by Category (Compact List Layout) */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
          <Container>
            <SectionHeading
              title="All PDF Tools by Category"
              subtitle="Access our complete directory of 26 utilities organized by workflow need."
              centered
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
              {TOOL_CATEGORIES.map((category) => {
                const catTools = TOOLS.filter((t) => t.category === category.id);
                return (
                  <div
                    key={category.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-4"
                  >
                    <div className="border-b border-slate-200/80 pb-3">
                      <h3 className="text-lg font-bold text-slate-900">
                        {category.label}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {category.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {catTools.map((tool) => (
                        <ToolCard key={tool.slug} tool={tool} variant="compact" />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Section 4: Why Choose Us */}
        <section className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-200/80">
          <Container>
            <SectionHeading
              title="Why PDFToolsHub?"
              subtitle="Engineered from the ground up for maximum privacy, blistering speed, and effortless accessibility."
              centered
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold text-xl">
                  🔒
                </div>
                <h3 className="text-xl font-bold text-slate-900">100% Private</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your files never leave your browser. Zero uploads, zero servers, zero third-party access. What happens on your device stays on your device.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 font-bold text-xl">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-slate-900">Instant Processing</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  All tools run locally using compiled WebAssembly. No waiting in cloud queues, no upload latency, and no network bottlenecks.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-bold text-xl">
                  📱
                </div>
                <h3 className="text-xl font-bold text-slate-900">Works Everywhere</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Desktop, tablet, or phone. No application to download or install. Fully responsive on modern web browsers across all platforms.
                </p>
              </div>
            </div>

            {/* Trust Badge Row */}
            <div className="mt-12 text-center">
              <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs">
                <span>No signup</span>
                <span>·</span>
                <span>No watermarks</span>
                <span>·</span>
                <span>No file limits</span>
                <span>·</span>
                <span className="text-blue-600 font-bold">Free forever</span>
              </div>
            </div>
          </Container>
        </section>

        {/* Section 5: Latest from Blog */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
              <div>
                <SectionHeading
                  title="PDF Guides & Tips"
                  subtitle="In-depth tutorials, file format guides, and productivity advice from our team."
                  className="mb-0"
                />
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                <span>View All Articles</span>
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

        {/* Section 6: FAQ */}
        <section className="py-16 sm:py-24 bg-slate-50/60">
          <Container>
            <SectionHeading
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about our browser-powered, privacy-first PDF platform."
              centered
            />

            <div className="max-w-3xl mx-auto">
              <FAQAccordion items={HOME_FAQS} />
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
