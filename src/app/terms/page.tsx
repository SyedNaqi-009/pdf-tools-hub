import React from 'react';
import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'Terms & Conditions | PDFToolsHub',
  'Review the terms of use, intellectual property guidelines, and conditions for using PDFToolsHub free online PDF utilities.',
  '/terms'
);

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      <div className="border-b border-slate-200/80 bg-white py-10 sm:py-14">
        <Container>
          <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} className="mb-6" />
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              Terms & Conditions
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
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using PDFToolsHub (the &quot;Service&quot;, available at pdftoolshub.com), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must refrain from using the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">2. Description of the Service</h2>
            <p>
              PDFToolsHub provides free, browser-based PDF utility tools, including merging, splitting, compressing, converting, editing, rotating, signing, and securing PDF documents. All processing is executed client-side within your web browser without uploading files to our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">3. Acceptable Use Policy</h2>
            <p>
              You agree to use PDFToolsHub solely for lawful purposes. You represent and warrant that:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>You possess all necessary rights, titles, and permissions to the documents you process using our tools.</li>
              <li>You will not use our tools to infringe upon the intellectual property, copyright, or privacy rights of any third party.</li>
              <li>You will not attempt to reverse engineer, disrupt, or introduce malicious scripts into our website infrastructure.</li>
              <li>You will not use automated scripts or scrapers to overwhelm or degrade the site for other users.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">4. Intellectual Property Rights</h2>
            <p>
              <strong>Your Documents:</strong> You retain 100% full and unencumbered ownership of all documents, images, and files you process on PDFToolsHub. Because your files are never uploaded to our servers, we claim zero ownership, license, or rights to your content.
            </p>
            <p>
              <strong>Our Platform:</strong> The visual interface, branding, code, documentation, logos, and design of PDFToolsHub are the exclusive property of PDFToolsHub and are protected by applicable copyright and trademark laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, PDFToolsHub, its operators, creators, and affiliates shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising out of your access to, use of, or inability to use the Service.
            </p>
            <p>
              This includes, without limitation, damages for loss of profits, loss of data, document corruption, business interruption, or any other commercial damages or losses, even if advised of the possibility thereof.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">6. Termination of Access</h2>
            <p>
              We reserve the right to restrict or block access to the Service for any user who violates these Terms and Conditions or engages in activities harmful to other users or our platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">7. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to conflict of law principles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">8. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding these Terms and Conditions, please contact us at support@pdftoolshub.com.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
