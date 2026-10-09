import React from 'react';
import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import SectionHeading from '@/components/ui/SectionHeading';
import ToolCard from '@/components/tools/ToolCard';
import { TOOLS, TOOL_CATEGORIES } from '@/lib/tools-data';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'All 26 Free Online PDF Tools — 100% Private & Browser-Based',
  'Explore all 26 professional PDF tools. Merge, compress, convert, split, sign, rotate, and protect PDF files directly in your browser with zero uploads.',
  '/tools'
);

export default function AllToolsPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Header */}
      <div className="border-b border-slate-200/80 bg-white py-10 sm:py-14">
        <Container>
          <Breadcrumbs items={[{ label: 'PDF Tools' }]} className="mb-6" />

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              All PDF Tools
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Choose from 26 high-performance, browser-powered PDF tools. All operations run 100% on your device using WebAssembly. No servers, no file limits, no accounts.
            </p>
          </div>
        </Container>
      </div>

      {/* Categorized Tools Sections */}
      <Container className="py-12 sm:py-16 space-y-16">
        {TOOL_CATEGORIES.map((cat) => {
          const categoryTools = TOOLS.filter((t) => t.category === cat.id);
          return (
            <section key={cat.id} id={cat.id} className="scroll-mt-24">
              <SectionHeading
                title={cat.label}
                subtitle={cat.description}
              />
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
