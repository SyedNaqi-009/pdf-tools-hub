import React from 'react';
import Link from 'next/link';
import { FileText, Shield, Cpu, Lock, CheckCircle2 } from 'lucide-react';
import Container from '../ui/Container';
import { TOOLS } from '@/lib/tools-data';

export default function Footer() {
  const coreTools = TOOLS.filter((t) => t.category === 'core').slice(0, 6);
  const convertTools = TOOLS.filter((t) => t.category === 'convert').slice(0, 6);
  const utilityTools = TOOLS.filter((t) => t.category === 'utility').slice(0, 6);

  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 text-zinc-400">
      {/* Top Engineering Strip */}
      <div className="border-b border-zinc-900 bg-zinc-900/40 py-6">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                <Shield className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-semibold text-zinc-200">Zero Server Uploads</p>
                <p className="text-[11px] text-zinc-500 font-mono">100% In-Memory RAM</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-950/60 text-rose-400 border border-rose-800/60">
                <Cpu className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-semibold text-zinc-200">WASM Micro-Engine</p>
                <p className="text-[11px] text-zinc-500 font-mono">Compiled Client Code</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/60">
                <Lock className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-semibold text-zinc-200">No Data Telemetry</p>
                <p className="text-[11px] text-zinc-500 font-mono">Zero Logs & Cookies</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/60">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-semibold text-zinc-200">ISO 32000 PDF</p>
                <p className="text-[11px] text-zinc-500 font-mono">Standard Compliant</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Studio Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <img
                  src="/icon.png"
                  alt="DoPDF Logo"
                  className="h-full w-full object-contain drop-shadow-md"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Do<span className="text-blue-500">PDF</span>
              </span>
            </Link>
            
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              The high-performance, client-side document processing platform. Transform, compress, convert, and secure PDF documents locally with absolute privacy and zero cloud footprint.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-mono text-zinc-300">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                <span>CLIENT-SIDE PRIVACY ENGINE</span>
              </div>
            </div>
          </div>

          {/* Column 2: Document Converters */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
              Document Converters
            </h3>
            <ul className="space-y-2 text-xs">
              {convertTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="hover:text-rose-400 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Core Operations */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
              Core Operations
            </h3>
            <ul className="space-y-2 text-xs">
              {coreTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="hover:text-rose-400 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources, Company & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
              Company & Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tools" className="hover:text-rose-400 transition-colors font-semibold text-zinc-300">
                  All 27 Tools Directory →
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-rose-400 transition-colors">
                  PDF Guides & Articles
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-rose-400 transition-colors">
                  About dopdf
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-rose-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-rose-400 transition-colors">
                  Privacy Policy & Zero-Log Promise
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-rose-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-rose-400 transition-colors">
                  Disclaimer & Security Notice
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p>© {new Date().getFullYear()} dopdf. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:underline">Disclaimer</Link>
            <span>•</span>
            <Link href="/sitemap.xml" className="hover:underline">Sitemap</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
