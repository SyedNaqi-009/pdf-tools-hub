import React from 'react';
import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'Disclaimer — Tool Limitations & No-Warranty Notice | PDFToolsHub',
  'Review our legal disclaimer regarding file conversion fidelity, client-side software accuracy, and warranty limitations.',
  '/disclaimer'
);

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-zinc-50 pb-24">
      {/* Studio Header Hero */}
      <div className="border-b border-zinc-900 bg-zinc-950 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-studio-grid opacity-25 pointer-events-none" />
        <Container className="relative">
          <Breadcrumbs items={[{ label: 'DISCLAIMER' }]} className="mb-6 text-zinc-400" />
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-mono font-bold text-zinc-300">
              <span>LEGAL LIMITATION & WARRANTY DISCLOSURE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Disclaimer
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono">
              Last Updated: March 2026 · Effective Date: Immediate
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-zinc-200 p-8 sm:p-14 shadow-xs space-y-8 text-zinc-700 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">1. &quot;As-Is&quot; and &quot;As-Available&quot; Provision</h2>
            <p>
              The information, software tools, and services provided on PDFToolsHub (accessible at pdftoolshub.com) are offered on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis, without warranties of any kind, whether express, implied, statutory, or otherwise.
            </p>
            <p>
              To the fullest extent permissible pursuant to applicable law, PDFToolsHub disclaims all warranties, express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, and title.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">2. File Conversion Accuracy & Fidelity Limitations</h2>
            <p>
              While our engineering team works diligently to ensure high fidelity across all document operations, PDF conversion and parsing inherently involve complex document object hierarchies, proprietary font subsets, custom vector paths, and differing typography engines.
            </p>
            <p>
              Consequently, PDFToolsHub does not guarantee that:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 font-mono text-xs sm:text-sm text-zinc-600">
              <li>Document conversions (such as PDF to Word, PDF to Excel, or Word to PDF) will achieve 100% pixel-perfect or format-identical reproduction of original designs.</li>
              <li>Extracted spreadsheet data will capture every nested cell merger or complex formula from scanned images.</li>
              <li>File compression will achieve specific percentage reductions without subtle visual shifts in embedded photographic assets.</li>
            </ul>
            <p>
              You are strongly advised to inspect and verify all converted or modified files before printing, distributing, submitting, or relying upon them for business, academic, or legal purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">3. No Legal, Financial, or Professional Advice</h2>
            <p>
              The content published on our blog, tutorials, guides, and tool pages is provided for general informational and educational purposes only. Nothing on PDFToolsHub should be construed as legal advice, compliance certification, tax guidance, or professional counsel.
            </p>
            <p>
              While digital signatures created using our Sign PDF tool are recognized under general electronic signature statutes (such as the US ESIGN Act or EU eIDAS), you are solely responsible for verifying the legal acceptability of electronic signatures for your specific transaction or jurisdiction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">4. User Responsibility for Data Backups</h2>
            <p>
              Because all processing is executed client-side in your browser memory, PDFToolsHub does not maintain copies or backups of your files. You are solely responsible for maintaining backup copies of all original source files prior to performing operations like page deletion, splitting, metadata stripping, or reordering.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">5. Contact Information</h2>
            <p>
              If you have any questions regarding this Disclaimer, please reach out to our team at:
            </p>
            <p className="font-mono text-xs sm:text-sm text-zinc-900 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              Email: support@pdftoolshub.com<br />
              Inquiries: pdftoolshub.com/contact
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
