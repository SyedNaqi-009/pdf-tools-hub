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
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Header */}
      <div className="border-b border-slate-200/80 bg-white py-10 sm:py-14">
        <Container>
          <Breadcrumbs items={[{ label: 'Blog' }]} className="mb-6" />

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              PDF Guides & Productivity Tips
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Master your document workflows with in-depth tutorials, file format comparisons, and privacy-first PDF tips written by our technical team.
            </p>
          </div>
        </Container>
      </div>

      {/* Posts Grid */}
      <Container className="py-12 sm:py-16">
        <SectionHeading
          title="Latest Articles & Guides"
          subtitle="Explore our practical tutorials to optimize, convert, and manage your PDF files."
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
