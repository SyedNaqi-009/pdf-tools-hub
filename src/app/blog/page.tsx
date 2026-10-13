import React from 'react';
import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import SectionHeading from '@/components/ui/SectionHeading';
import BlogCard from '@/components/blog/BlogCard';
import { getAllBlogPosts } from '@/lib/blog';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'PDF Guides, Tutorials & Productivity Tips | PDFToolsHub Blog',
  'Read our comprehensive step-by-step guides on merging, compressing, converting, editing, and securing PDF documents online.',
  '/blog'
);

export default function BlogListingPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="min-h-screen bg-zinc-50 pb-24">
      {/* Studio Hero Header */}
      <div className="border-b border-zinc-900 bg-zinc-950 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-studio-grid opacity-25 pointer-events-none" />
        <Container className="relative">
          <Breadcrumbs items={[{ label: 'GUIDES & BLOG' }]} className="mb-6 text-zinc-400" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-900/60 bg-rose-950/40 px-3 py-1 text-xs font-mono font-bold text-rose-400">
              <span>EDITORIAL ARCHIVE // 15 COMPREHENSIVE GUIDES</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              PDF Guides & Tutorials
            </h1>
            
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Step-by-step technical guides, format specifications, and best practices for optimizing, converting, and securing documents using client-side technologies.
            </p>
          </div>
        </Container>
      </div>

      {/* Posts Grid */}
      <Container className="py-14 sm:py-20">
        <SectionHeading
          badge="ARTICLE DIRECTORY"
          title="All Engineering & Workflow Guides"
          subtitle="Explore in-depth documentation written to help you work faster and safeguard your document data."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </main>
  );
}
