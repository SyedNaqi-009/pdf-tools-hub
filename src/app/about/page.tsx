import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Cpu, Zap, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'About Us — Privacy-First Client-Side PDF Tools | dopdf',
  'Learn about dopdf and our mission to provide fast, 100% private, browser-based PDF utilities with zero server uploads and zero data retention.',
  '/about'
);

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-50 pb-24">
      {/* Header Hero */}
      <div className="border-b border-zinc-900 bg-zinc-950 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-studio-grid opacity-25 pointer-events-none" />
        <Container className="relative">
          <Breadcrumbs items={[{ label: 'ABOUT US' }]} className="mb-6 text-zinc-400" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-900/60 bg-rose-950/40 px-3 py-1 text-xs font-mono font-bold text-rose-400">
              <span>OUR ARCHITECTURAL PHILOSOPHY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              About dopdf
            </h1>
            
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              We believe everyday document utilities should be instant, reliable, completely free, and above all — 100% private.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Mission */}
          <section className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-12 shadow-xs space-y-4">
            <h2 className="text-2xl font-black text-zinc-950">Our Mission: Redefining Document Privacy</h2>
            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
              For years, web users needing to merge, convert, or compress a simple PDF had no choice but to upload sensitive documents — including bank statements, corporate contracts, tax returns, and medical records — to mysterious cloud servers. Many legacy services quietly store files in temporary caches, analyze metadata, or charge steep monthly subscriptions for basic features.
            </p>
            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
              dopdf was built to solve this problem permanently. Leveraging modern WebAssembly, HTML5 Canvas, and advanced client-side JavaScript, our entire suite of 27 PDF utilities operates <strong>100% inside your web browser</strong>. Your documents never travel over the internet, and zero bytes ever touch our servers.
            </p>
          </section>

          {/* How Our Technology Works */}
          <section className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-12 shadow-xs space-y-6">
            <h2 className="text-2xl font-black text-zinc-950">How Client-Side PDF Processing Works</h2>
            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
              Instead of running costly cloud server farms that ingest user documents, dopdf downloads lightweight, compiled WebAssembly modules directly to your browser sandbox. When you drop a PDF into our workspace:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-rose-400">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-zinc-900 text-sm">Local Execution</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Calculations, stream parsing, and rendering run entirely on your device CPU and RAM.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-zinc-900 text-sm">Zero Network Leakage</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Your files are never transmitted across the network, meaning nobody can intercept them.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-950 text-rose-400">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-zinc-900 text-sm">No Waiting Queues</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Because you do not wait for busy cloud server queues, processing is virtually instantaneous.
                </p>
              </div>
            </div>
          </section>

          {/* Team / Founder */}
          <section className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-12 shadow-xs space-y-4">
            <h2 className="text-2xl font-black text-zinc-950">The Team Behind dopdf</h2>
            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
              dopdf is developed and maintained by a dedicated group of full-stack engineers, privacy advocates, and document standards specialists. We are passionate about the open web, digital privacy rights, and building software that respects user dignity.
            </p>
            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
              We continually audit our codebase to guarantee that no telemetry, third-party analytics trackers, or hidden upload hooks compromise our privacy promises. We believe in providing essential digital utilities without predatory paywalls or deceptive marketing.
            </p>
          </section>

          {/* CTA Section */}
          <div className="rounded-3xl bg-zinc-950 p-8 sm:p-12 text-white text-center space-y-4 border border-zinc-800 shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to Experience Zero-Upload PDF Tools?</h3>
            <p className="text-zinc-400 max-w-xl mx-auto text-xs sm:text-sm">
              Try our suite of 27 free utilities right now. No signup, no credit cards, and absolute privacy guaranteed.
            </p>
            <div className="pt-2">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-7 py-3.5 text-xs sm:text-sm font-black text-white uppercase tracking-wider font-mono hover:bg-rose-500 transition-colors shadow-lg shadow-rose-950/40"
              >
                <span>Browse All 27 Tools</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
