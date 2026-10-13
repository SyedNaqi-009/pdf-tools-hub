import React from 'react';
import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'Privacy Policy — Zero File Uploads & Local Processing | PDFToolsHub',
  'Read the PDFToolsHub Privacy Policy. We guarantee zero file uploads, zero server-side storage, and strict document confidentiality.',
  '/privacy-policy'
);

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-zinc-50 pb-24">
      {/* Studio Header Hero */}
      <div className="border-b border-zinc-900 bg-zinc-950 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-studio-grid opacity-25 pointer-events-none" />
        <Container className="relative">
          <Breadcrumbs items={[{ label: 'PRIVACY POLICY' }]} className="mb-6 text-zinc-400" />
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/60 bg-emerald-950/40 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
              <span>ZERO-TELEMETRY LEGAL PLEDGE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Privacy Policy
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
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">1. Our Core Commitment: Zero File Uploads</h2>
            <p>
              At PDFToolsHub (accessible from pdftoolshub.com), your privacy is not merely an afterthought — it is the foundational architecture upon which our entire platform is engineered. We understand that PDF documents frequently contain sensitive, private, proprietary, financial, or personal information.
            </p>
            <p>
              <strong>We do not upload, transmit, store, inspect, process, or retain any of your PDF files or converted documents on our servers.</strong> Every single tool on PDFToolsHub operates entirely within your web browser (client-side) using WebAssembly, HTML5 APIs, and JavaScript. Your files never leave your local device memory (RAM), ensuring absolute confidentiality.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">2. Information We Do NOT Collect</h2>
            <p>Because of our client-side architecture:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 font-mono text-xs sm:text-sm text-zinc-600">
              <li>We do <strong>not</strong> collect or read the contents of your PDF files.</li>
              <li>We do <strong>not</strong> collect names, social security numbers, banking details, or text found in your documents.</li>
              <li>We do <strong>not</strong> store passwords entered into our password protect or unlock tools.</li>
              <li>We do <strong>not</strong> store digital signatures drawn on our signing canvas.</li>
              <li>We do <strong>not</strong> maintain temporary file caches, buckets, or cloud servers holding your documents.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">3. Standard Technical Web Logs</h2>
            <p>
              Like almost all websites on the internet, our hosting infrastructure (such as Vercel content delivery networks) may automatically log standard non-personally identifiable technical diagnostic data when your browser requests static assets (HTML, CSS, JavaScript files). This telemetry may include:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 text-xs sm:text-sm text-zinc-600">
              <li>Internet Protocol (IP) address</li>
              <li>Browser type and operating system version</li>
              <li>Referring and exit URLs</li>
              <li>Date and time stamps of page requests</li>
            </ul>
            <p>
              This technical information is utilized solely to monitor site uptime, maintain network security, mitigate DDoS attacks, and optimize static asset delivery speed. It is never associated with your private documents.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">4. Cookies and Web Beacons</h2>
            <p>
              PDFToolsHub does not use intrusive tracking cookies, cross-site profiling trackers, or session recording scripts. We may use minimal, privacy-compliant functional cookies to preserve user preferences (such as light/dark mode choices). You can disable cookies at any time via your browser settings without affecting the functionality of our client-side PDF tools.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">5. Compliance with Global Privacy Frameworks</h2>
            <h3 className="font-bold text-zinc-900 text-sm sm:text-base">General Data Protection Regulation (GDPR)</h3>
            <p>
              For users residing in the European Economic Area (EEA), because we do not collect, process, or store your personal document data, we act neither as a data controller nor as a data processor for the files you manipulate on your device.
            </p>
            <h3 className="font-bold text-zinc-900 text-sm sm:text-base">California Consumer Privacy Act (CCPA / CPRA)</h3>
            <p>
              We do not sell, rent, or trade your personal information to third parties. We do not exchange consumer personal information for monetary or valuable consideration.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">6. Contact Information</h2>
            <p>
              If you have any questions or feedback regarding our privacy practices, please contact us at:
            </p>
            <p className="font-mono text-xs sm:text-sm text-zinc-900 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              Email: privacy@pdftoolshub.com<br />
              Inquiries: pdftoolshub.com/contact
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
