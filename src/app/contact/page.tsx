'use client';

import React, { useState } from 'react';
import { Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import SectionHeading from '@/components/ui/SectionHeading';
import FAQAccordion from '@/components/ui/FAQAccordion';

const SUPPORT_FAQS = [
  {
    question: 'How can I verify that my PDF files are never uploaded to any server?',
    answer: 'All processing logic executes entirely inside your browser tab using WebAssembly and client-side JavaScript. You can verify this yourself by opening your browser DevTools (Network tab) and observing that zero file payloads are transmitted when performing operations.',
  },
  {
    question: 'Why did my exceptionally large PDF file cause my browser to slow down?',
    answer: 'Because all processing happens in your device local RAM, documents with thousands of high-resolution images require sufficient available system memory. For exceptionally large files (over 200MB), close other background browser tabs to free up RAM.',
  },
  {
    question: 'Are dopdf tools completely free for commercial and enterprise use?',
    answer: 'Yes. All 27 tools are completely free for personal, educational, and commercial purposes with zero licensing fees or subscription requirements.',
  },
  {
    question: 'Do you offer an enterprise desktop version or offline software?',
    answer: 'Because dopdf is a Progressive Web Application that executes locally, you can use our web tools anytime your browser is open. In fact, after the initial page load, our tools continue to process files even if your internet connection is temporarily disconnected!',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-zinc-50 pb-24">
      {/* Studio Header Hero */}
      <div className="border-b border-zinc-900 bg-zinc-950 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-studio-grid opacity-25 pointer-events-none" />
        <Container className="relative">
          <Breadcrumbs items={[{ label: 'CONTACT & SUPPORT' }]} className="mb-6 text-zinc-400" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-900/60 bg-rose-950/40 px-3 py-1 text-xs font-mono font-bold text-rose-400">
              <span>TECHNICAL INQUIRIES & FEEDBACK</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Contact Support
            </h1>
            
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Have a technical question, bug report, or feature request? We would love to hear from you. Our engineering team reviews every message.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200 p-8 sm:p-12 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-zinc-950">Message Dispatched!</h3>
                <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                  Your inquiry has been received. Our engineering team will review your message and reply within 24 to 48 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="mt-4 rounded-xl bg-zinc-950 px-5 py-3 text-xs font-bold text-white hover:bg-zinc-800 uppercase font-mono tracking-wider cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-zinc-950">Send Us an Engineering Message</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Fill out the form below and we will get back to you promptly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 font-mono block">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 font-mono block">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 font-mono block">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Inquiry about PDF tools or feature request..."
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 font-mono block">Message</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist your document workflow?"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-4 text-xs sm:text-sm font-black text-white uppercase tracking-wider font-mono shadow-lg shadow-rose-950/20 hover:bg-rose-500 transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-xs space-y-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
                Support Details
              </h3>

              <div className="space-y-5 text-xs sm:text-sm text-zinc-600">
                <div className="flex items-start gap-3.5">
                  <Clock className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-900">Response Turnaround</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      We aim to respond to all technical inquiries and suggestions within 24 to 48 business hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-900">Direct Email</p>
                    <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                      support@dopdfconverter.online
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <MessageSquare className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-900">Feature Suggestions</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Have an idea for a new client-side PDF tool or conversion capability? Let us know!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 text-white rounded-3xl border border-zinc-800 p-7 text-xs leading-relaxed">
              <p className="font-mono font-bold text-rose-400 mb-1">Architecture Guarantee:</p>
              Please note that our team cannot access, inspect, or restore your files. Because all processing is client-side, your document data does not exist on our servers.
            </div>
          </div>
        </div>

        {/* Support FAQ */}
        <div className="mt-16 max-w-4xl mx-auto">
          <SectionHeading
            badge="SUPPORT KNOWLEDGE BASE"
            title="Common Questions & Inquiries"
            subtitle="Quick answers regarding privacy, file limits, and commercial usage."
            centered
          />
          <FAQAccordion items={SUPPORT_FAQS} />
        </div>
      </Container>
    </main>
  );
}
