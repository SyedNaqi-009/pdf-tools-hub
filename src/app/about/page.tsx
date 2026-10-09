import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Cpu, Zap, Lock, ArrowRight, Heart } from 'lucide-react';
import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import SectionHeading from '@/components/ui/SectionHeading';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'About Us — Privacy-First Client-Side PDF Tools | PDFToolsHub',
  'Learn about PDFToolsHub and our mission to provide fast, 100% private, browser-based PDF utilities with zero server uploads and zero data retention.',
  '/about'
);

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <div className="border-b border-slate-200/80 bg-white py-10 sm:py-14">
        <Container>
          <Breadcrumbs items={[{ label: 'About Us' }]} className="mb-6" />

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              About PDFToolsHub
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              We believe everyday document tools should be instant, reliable, completely free, and above all — 100% private.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Mission */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Our Mission: Redefining Document Privacy</h2>
            <p className="text-base text-slate-700 leading-relaxed">
              For years, web users needing to merge, convert, or compress a simple PDF had no choice but to upload sensitive documents — including bank statements, contracts, tax returns, and medical records — to mysterious cloud servers. Many of these legacy services quietly store files in temporary caches, analyze metadata, or charge steep monthly subscriptions for basic features.
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              PDFToolsHub was built to solve this problem permanently. Leveraging modern WebAssembly, HTML5 Canvas, and advanced client-side JavaScript, our entire suite of 26 PDF utilities operates <strong>100% inside your web browser</strong>. Your documents never travel over the internet, and zero bytes ever touch our servers.
            </p>
          </section>

          {/* How Our Technology Works */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">How Client-Side PDF Processing Works</h2>
            <p className="text-base text-slate-700 leading-relaxed">
              Instead of running costly cloud server farms that ingest user documents, PDFToolsHub downloads lightweight, compiled WebAssembly modules directly to your browser sandbox. When you drop a PDF into our workspace:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Local Execution</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Calculations, stream parsing, and rendering run entirely on your device CPU and RAM.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Zero Network Leakage</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your files are never transmitted across the network, meaning nobody can intercept them.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">No Waiting Queues</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Because you do not wait for busy cloud server queues, processing is virtually instantaneous.
                </p>
              </div>
            </div>
          </section>

          {/* Team / Founder */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">The Team Behind PDFToolsHub</h2>
            <p className="text-base text-slate-700 leading-relaxed">
              PDFToolsHub is developed and maintained by a dedicated group of full-stack engineers, privacy advocates, and document standards specialists. We are passionate about the open web, digital privacy rights, and building software that respects user dignity.
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              We continually audit our codebase to guarantee that no telemetry, third-party analytics trackers, or hidden upload hooks compromise our privacy promises. We believe in providing essential digital utilities without predatory paywalls or deceptive marketing.
            </p>
          </section>

          {/* CTA Section */}
          <div className="rounded-2xl bg-blue-600 p-8 sm:p-10 text-white text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Experience Zero-Upload PDF Tools?</h3>
            <p className="text-blue-100 max-w-xl mx-auto text-sm sm:text-base">
              Try our suite of 26 free utilities right now. No signup, no credit cards, and absolute privacy guaranteed.
            </p>
            <div className="pt-2">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm sm:text-base font-bold text-blue-600 shadow-md hover:bg-blue-50 transition-colors"
              >
                <span>Browse All 26 Tools</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
