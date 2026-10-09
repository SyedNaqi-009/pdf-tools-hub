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
    <main className="min-h-screen bg-slate-50/50 pb-20">
      <div className="border-b border-slate-200/80 bg-white py-10 sm:py-14">
        <Container>
          <Breadcrumbs items={[{ label: 'Disclaimer' }]} className="mb-6" />
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              Disclaimer
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-500">
              Last Updated: March 2026 · Effective Date: Immediate
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">1. &quot;As-Is&quot; and &quot;As-Available&quot; Provision</h2>
            <p>
              The information, software tools, and services provided on PDFToolsHub (accessible at pdftoolshub.com) are offered on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis, without warranties of any kind, whether express, implied, statutory, or otherwise.
            </p>
            <p>
              To the fullest extent permissible pursuant to applicable law, PDFToolsHub disclaims all warranties, express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, and title.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">2. File Conversion Accuracy & Fidelity Limitations</h2>
            <p>
              While our engineering team works diligently to ensure high fidelity across all document operations, PDF conversion and parsing inherently involve complex document object hierarchies, proprietary font subsets, custom vector paths, and differing typography engines.
            </p>
            <p>
              Consequently, PDFToolsHub does not guarantee that:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>Document conversions (such as PDF to Word, PDF to Excel, or Word to PDF) will achieve 100% pixel-perfect or format-identical reproduction of original designs.</li>
              <li>Extracted spreadsheet data will capture every nested cell merger or complex formula from scanned images.</li>
              <li>File compression will achieve specific percentage reductions without subtle visual shifts in embedded photographic assets.</li>
            </ul>
            <p>
              You are strongly advised to inspect and verify all converted or modified files before printing, distributing, submitting, or relying upon them for business, academic, or legal purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">3. No Legal, Financial, or Professional Advice</h2>
            <p>
              The content published on our blog, tutorials, guides, and tool pages is provided for general informational and educational purposes only. Nothing on PDFToolsHub should be construed as legal advice, compliance certification, tax guidance, or professional counsel.
            </p>
            <p>
              While digital signatures created using our Sign PDF tool are recognized under general electronic signature statutes (such as the US ESIGN Act or EU eIDAS), you are solely responsible for verifying the legal acceptability of electronic signatures for your specific transaction or jurisdiction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">4. User Responsibility for Data Backups</h2>
            <p>
              Because all processing is executed client-side in your browser memory, PDFToolsHub does not maintain copies or backups of your files. You are solely responsible for maintaining backup copies of all original source files prior to performing operations like page deletion, splitting, metadata stripping, or reordering.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">5. Contact Us</h2>
            <p>
              If you have any questions regarding this Disclaimer, please reach out to our team at support@pdftoolshub.com.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
