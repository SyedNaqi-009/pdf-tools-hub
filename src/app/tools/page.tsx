import React from 'react';
import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import CategoryFilteredTools from '@/components/tools/CategoryFilteredTools';
import ToolCard from '@/components/tools/ToolCard';
import { TOOLS, TOOL_CATEGORIES } from '@/lib/tools-data';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'All 27 Free Online PDF Tools — 100% Private & Browser-Based | dopdf',
  'Explore all 27 professional PDF tools. Merge, compress, convert, translate, split, sign, rotate, and protect PDF files directly in your browser with zero uploads.',
  '/tools'
);

export default function AllToolsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 pb-24">
      {/* Header Hero */}
      <div className="border-b border-zinc-900 bg-zinc-950 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-studio-grid opacity-25 pointer-events-none" />
        <Container className="relative">
          <Breadcrumbs items={[{ label: 'ALL TOOLS' }]} className="mb-6 text-zinc-400" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-900/60 bg-rose-950/40 px-3 py-1 text-xs font-mono font-bold text-rose-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>COMPLETE 27-MODULE SUITE // ACTIVE WORKSTATION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              All PDF Tools Directory
            </h1>
            
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Explore our complete collection of 27 browser-powered document utilities. All tasks execute 100% locally on your machine using compiled WebAssembly. No servers, no queues, and zero file uploads.
            </p>

            {/* Quick Category Anchors */}
            <div className="pt-2 flex flex-wrap gap-2">
              {TOOL_CATEGORIES.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-mono font-semibold text-zinc-300 hover:border-rose-500 hover:text-rose-400 transition-colors"
                >
                  Jump to {cat.label} →
                </a>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Interactive Category Filtered Tools (Image 1 Style) */}
      <Container className="py-10 sm:py-14">
        <CategoryFilteredTools initialCategory="convert" />
      </Container>

      {/* Categorized Tool Sections Anchor Directory */}
      <Container className="pb-16 sm:pb-24 space-y-16">
        <div className="border-t border-zinc-200 pt-10">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-2">
            Complete Index by Module
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mb-8">
            Detailed breakdown of all 27 browser-side utilities grouped by functional domain.
          </p>
        </div>
        {TOOL_CATEGORIES.map((cat, index) => {
          const categoryTools = TOOLS.filter((t) => t.category === cat.id);
          return (
            <section key={cat.id} id={cat.id} className="scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-zinc-200 gap-4">
                <div>
                  <span className="font-mono text-xs font-bold text-rose-600 uppercase">
                    SECTION 0{index + 1} DIRECTORY
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-1">
                    {cat.label}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-zinc-600">
                    {cat.description}
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-500 bg-white px-3 py-1 rounded-lg border border-zinc-200 self-start sm:self-auto">
                  {categoryTools.length} Utilities
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </Container>
    </main>
  );
}
