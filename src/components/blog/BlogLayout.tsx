import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Share2, ShieldCheck } from 'lucide-react';
import Container from '../ui/Container';
import Breadcrumbs from '../layout/Breadcrumbs';
import { BlogPostMeta } from '@/lib/blog';
import { getTier1Tools } from '@/lib/tools-data';

interface BlogLayoutProps {
  post: BlogPostMeta;
  children: React.ReactNode;
}

export default function BlogLayout({ post, children }: BlogLayoutProps) {
  const popularTools = getTier1Tools().slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Article Header */}
      <div className="border-b border-slate-200/80 bg-white py-10 sm:py-14">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
            className="mb-6"
          />

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {post.title}
            </h1>

            <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-3xl">
              {post.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 border-t border-slate-100 pt-4">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <User className="h-4 w-4 text-slate-400" />
                {post.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                <time dateTime={post.date}>{post.date}</time>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" />
                {post.readingTime}
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* Article Content & Sidebar */}
      <Container className="py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <article className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
              {children}
            </div>

            {/* End of Post CTA & Author Box */}
            <div className="mt-12 border-t border-slate-200 pt-8 space-y-6">
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <h4 className="text-base font-bold text-slate-900">
                    Free & Private PDF Tools
                  </h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Put this guide into practice! Use our suite of 26 free browser-based PDF tools with zero file uploads and 100% privacy.
                </p>
                <div className="mt-4">
                  <Link
                    href="/tools"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-blue-700 transition-colors"
                  >
                    <span>Explore All PDF Tools</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Blog Articles</span>
                </Link>
              </div>
            </div>
          </article>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Quick Tools Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Most Popular Tools
              </h3>
              <ul className="space-y-3">
                {popularTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-blue-600"
                    >
                      <span>{tool.name}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-transform" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link
                  href="/tools"
                  className="block text-center rounded-lg bg-slate-50 border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  View All 26 Free Tools →
                </Link>
              </div>
            </div>

            {/* Privacy Commitment Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
                <ShieldCheck className="h-5 w-5" />
                <span>Zero Server Uploads</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                All document processing on PDFToolsHub runs locally in your browser memory. We never upload, inspect, or retain your files.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}
