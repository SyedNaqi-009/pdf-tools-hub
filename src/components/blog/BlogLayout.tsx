import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
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
    <main className="min-h-screen bg-zinc-50 pb-24">
      {/* Article Header Hero */}
      <div className="border-b border-zinc-900 bg-zinc-950 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-studio-grid opacity-25 pointer-events-none" />
        <Container className="relative">
          <Breadcrumbs
            items={[
              { label: 'BLOG', href: '/blog' },
              { label: post.title },
            ]}
            className="mb-6 text-zinc-400"
          />

          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-rose-950/80 px-2.5 py-1 text-[11px] font-mono font-bold text-rose-400 border border-rose-900/60 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {post.title}
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl">
              {post.description}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 border-t border-zinc-900">
              <span className="flex items-center gap-1.5 text-zinc-300 font-bold">
                <User className="h-3.5 w-3.5 text-rose-400" />
                {post.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.date}>{post.date}</time>
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* Article Content & Sidebar */}
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Content */}
          <article className="lg:col-span-8 bg-white rounded-3xl border border-zinc-200 p-7 sm:p-12 shadow-xs">
            <div className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed text-sm sm:text-base">
              {children}
            </div>

            {/* End of Post CTA Box */}
            <div className="mt-14 border-t border-zinc-200 pt-8 space-y-6">
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-7 text-white space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Experience Client-Side PDF Tools
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Put the concepts from this guide into action! Use our suite of 26 browser-based PDF utilities with zero file uploads and 100% privacy.
                </p>
                <div>
                  <Link
                    href="/tools"
                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-xs font-bold text-white uppercase font-mono tracking-wider hover:bg-rose-500 transition-colors"
                  >
                    <span>Launch PDF Studio</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-zinc-600 hover:text-rose-600 uppercase"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Return to Guides Directory</span>
                </Link>
              </div>
            </div>
          </article>

          {/* Sticky Workstation Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-xs space-y-5">
              <div className="border-b border-zinc-100 pb-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
                  Popular Utilities
                </h3>
              </div>
              <ul className="space-y-3">
                {popularTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="group flex items-center justify-between text-xs font-semibold text-zinc-700 hover:text-rose-600"
                    >
                      <span>{tool.name}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:translate-x-1 group-hover:text-rose-600 transition-transform" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link
                  href="/tools"
                  className="block text-center rounded-xl bg-zinc-50 border border-zinc-200 py-3 text-xs font-mono font-bold text-zinc-800 hover:bg-zinc-100 uppercase"
                >
                  Browse All 26 Tools →
                </Link>
              </div>
            </div>

            {/* Privacy Architecture Box */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs font-mono">
                <ShieldCheck className="h-4 w-4" />
                <span>Zero Server Uploads Guarantee</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                All document operations run exclusively inside your browser RAM. Nothing is ever uploaded or retained.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}
