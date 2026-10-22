import React from 'react';
import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'Terms & Conditions | dopdf',
  'Review the terms of use, intellectual property guidelines, and conditions for using dopdf free online PDF utilities.',
  '/terms'
);

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 pb-24">
      {/* Header Hero */}
      <div className="border-b border-zinc-900 bg-zinc-950 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-studio-grid opacity-25 pointer-events-none" />
        <Container className="relative">
          <Breadcrumbs items={[{ label: 'TERMS & CONDITIONS' }]} className="mb-6 text-zinc-400" />
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-mono font-bold text-zinc-300">
              <span>SERVICE USAGE AGREEMENT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Terms & Conditions
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
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">1. Acceptance of Terms</h2>
            <p>
              By accessing and using dopdf (the &quot;Service&quot;, available at dopdfconverter.online), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must refrain from using the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">2. Description of the Service</h2>
            <p>
              dopdf provides free, browser-based PDF utility tools, including merging, splitting, compressing, converting, editing, rotating, signing, and securing PDF documents. All processing is executed client-side within your web browser without uploading files to our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">3. Acceptable Use Policy</h2>
            <p>
              You agree to use dopdf solely for lawful purposes. You represent and warrant that:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 font-mono text-xs sm:text-sm text-zinc-600">
              <li>You possess all necessary rights, titles, and permissions to the documents you process using our tools.</li>
              <li>You will not use our tools to infringe upon the intellectual property, copyright, or privacy rights of any third party.</li>
              <li>You will not attempt to reverse engineer, disrupt, or introduce malicious scripts into our website infrastructure.</li>
              <li>You will not use automated scripts or scrapers to overwhelm or degrade the site for other users.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">4. Intellectual Property Rights</h2>
            <p>
              <strong>Your Documents:</strong> You retain 100% full and unencumbered ownership of all documents, images, and files you process on dopdf. Because your files are never uploaded to our servers, we claim zero ownership, license, or rights to your content.
            </p>
            <p>
              <strong>Our Platform:</strong> The visual interface, branding, code, documentation, logos, and design of dopdf are the exclusive property of dopdf and are protected by applicable copyright and trademark laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, dopdf, its operators, creators, and affiliates shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising out of your access to, use of, or inability to use the Service.
            </p>
            <p>
              This includes, without limitation, damages for loss of profits, loss of data, document corruption, business interruption, or any other commercial damages or losses, even if advised of the possibility thereof.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">6. Contact Information</h2>
            <p>
              If you have any questions or concerns regarding these Terms and Conditions, please contact us at:
            </p>
            <p className="font-mono text-xs sm:text-sm text-zinc-900 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              Email: support@dopdfconverter.online<br />
              Website: dopdfconverter.online/contact
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
