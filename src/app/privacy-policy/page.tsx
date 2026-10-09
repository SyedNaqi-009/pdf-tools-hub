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
    <main className="min-h-screen bg-slate-50/50 pb-20">
      <div className="border-b border-slate-200/80 bg-white py-10 sm:py-14">
        <Container>
          <Breadcrumbs items={[{ label: 'Privacy Policy' }]} className="mb-6" />
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              Privacy Policy
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
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">1. Our Core Commitment: Zero File Uploads</h2>
            <p>
              At PDFToolsHub (accessible from pdftoolshub.com), your privacy is not merely an afterthought — it is the foundational architecture upon which our entire platform is engineered. We understand that PDF documents frequently contain sensitive, private, proprietary, financial, or personal information.
            </p>
            <p>
              <strong>We do not upload, transmit, store, inspect, process, or retain any of your PDF files or converted documents on our servers.</strong> Every single tool on PDFToolsHub operates entirely within your web browser (client-side) using WebAssembly, HTML5 APIs, and JavaScript. Your files never leave your local device memory (RAM), ensuring absolute confidentiality.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">2. Information We Do NOT Collect</h2>
            <p>Because of our client-side architecture:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>We do <strong>not</strong> collect or read the contents of your PDF files.</li>
              <li>We do <strong>not</strong> collect names, social security numbers, banking details, or text found in your documents.</li>
              <li>We do <strong>not</strong> store passwords entered into our password protect or unlock tools.</li>
              <li>We do <strong>not</strong> store digital signatures drawn on our signing canvas.</li>
              <li>We do <strong>not</strong> maintain temporary file caches, buckets, or cloud servers holding your documents.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">3. Standard Technical Web Logs</h2>
            <p>
              Like almost all websites on the internet, our hosting infrastructure (such as Vercel content delivery networks) may automatically log standard non-personally identifiable technical diagnostic data when your browser requests static assets (HTML, CSS, JavaScript files). This telemetry may include:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
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
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">4. Cookies and Web Beacons</h2>
            <p>
              PDFToolsHub does not use intrusive tracking cookies, cross-site profiling trackers, or session recording scripts. We may use minimal, privacy-compliant functional cookies to preserve user preferences (such as light/dark mode choices). You can disable cookies at any time via your browser settings without affecting the functionality of our client-side PDF tools.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">5. Third-Party Services & Links</h2>
            <p>
              Our website may contain links to external third-party resources or documentation for your convenience. Please be aware that we have no control over the privacy policies or practices of third-party websites. We encourage you to review the privacy notices of any external site you visit.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">6. Compliance with Global Privacy Frameworks</h2>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">General Data Protection Regulation (GDPR)</h3>
            <p>
              For users residing in the European Economic Area (EEA), because we do not collect, process, or store your personal document data, we act neither as a data controller nor as a data processor for the files you manipulate on your device.
            </p>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">California Consumer Privacy Act (CCPA / CPRA)</h3>
            <p>
              We do not sell, rent, or trade your personal information to third parties. We do not exchange consumer personal information for monetary or valuable consideration.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">7. Children&apos;s Privacy</h2>
            <p>
              PDFToolsHub does not knowingly collect any personally identifiable information from children under the age of 13. If you believe your child has submitted personal details through our contact form, please contact us immediately so we can promptly delete the message.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">8. Changes to This Privacy Policy</h2>
            <p>
              We reserve the right to update this Privacy Policy periodically to reflect technological improvements or legal requirements. Any modifications will be posted directly on this page with an updated effective date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">9. Contact Information</h2>
            <p>
              If you have any questions or feedback regarding our privacy practices, please contact us at:
            </p>
            <p className="font-semibold text-slate-900">
              Email: privacy@pdftoolshub.com<br />
              Website: pdftoolshub.com/contact
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
