import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck, Zap, Lock } from 'lucide-react';
import Container from '../ui/Container';
import { getTier1Tools } from '@/lib/tools-data';

export default function Footer() {
  const tier1Tools = getTier1Tools();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-700">
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Privacy Commitment */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Layers className="h-4 w-4" />
              </span>
              <span>
                PDF<span className="text-blue-600">Tools</span>Hub
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed">
              Premium browser-based PDF suite. Merge, compress, convert, and manage documents with zero server uploads, absolute privacy, and instant speed.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>100% Client-Side Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>No File Tracking or Cloud Logs</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>No Wait Queues or Size Limits</span>
              </div>
            </div>
          </div>

          {/* Column 2: Popular Tools (Tier 1) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Popular Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              {tier1Tools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tools"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View All 26 Tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Guides */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Resources & Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/blog" className="hover:text-blue-600 transition-colors">
                  PDF Guides & Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/tools/merge-pdf" className="hover:text-blue-600 transition-colors">
                  Merge Tool
                </Link>
              </li>
              <li>
                <Link href="/tools/compress-pdf" className="hover:text-blue-600 transition-colors">
                  Compress Tool
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Privacy */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Legal & Trust
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-blue-600 transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-medium text-slate-900">Zero Server Uploads</p>
              <p className="mt-1 text-xs text-slate-500 leading-normal">
                Your documents stay inside your device RAM. We cannot read, store, or intercept your files.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PDFToolsHub. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Engineered for speed, privacy, and productivity. Built with Next.js 15.
          </p>
        </div>
      </Container>
    </footer>
  );
}
