'use client';

import React, { useState } from 'react';
import { Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import FAQAccordion from '@/components/ui/FAQAccordion';

const SUPPORT_FAQS = [
  {
    question: 'How can you guarantee that my PDF files are never uploaded?',
    answer: 'All processing logic runs entirely inside your browser tab using WebAssembly and client-side JavaScript. You can verify this yourself by opening your browser DevTools (Network tab) and observing that zero file payloads are transmitted when performing operations.',
  },
  {
    question: 'Why did my very large PDF file cause my browser to slow down?',
    answer: 'Because all processing happens in your device local RAM, documents with thousands of high-resolution images require sufficient available system memory. For exceptionally large files (over 200MB), close other background browser tabs to free up RAM.',
  },
  {
    question: 'Are PDFToolsHub tools completely free for commercial use?',
    answer: 'Yes. All 26 tools are completely free for personal, educational, and commercial purposes with zero licensing fees or subscription requirements.',
  },
  {
    question: 'Do you offer an enterprise desktop version or offline software?',
    answer: 'Because PDFToolsHub is a Progressive Web Application that executes locally, you can use our web tools anytime your browser is open. In fact, after the initial page load, our tools continue to process files even if your internet connection is temporarily disconnected!',
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
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <div className="border-b border-slate-200/80 bg-white py-10 sm:py-14">
        <Container>
          <Breadcrumbs items={[{ label: 'Contact Us' }]} className="mb-6" />

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              Contact Us
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Have a question, feedback, or a tool suggestion? We would love to hear from you. Our engineering and support team reviews every message.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Thank You!</h3>
                <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your message has been received. Our team will review your inquiry and respond within 24 to 48 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Send Us a Message</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Fill out the form below and we will get back to you promptly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Inquiry about PDF tools or feature request..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Message</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you today?"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Info & Expectation Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Support Details
              </h3>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Response Time</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      We aim to respond to all technical inquiries and suggestions within 24 to 48 business hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Email Contact</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      support@pdftoolshub.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Feature Requests</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Have an idea for a new client-side PDF tool or conversion capability? Let us know!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/70 rounded-2xl border border-blue-200 p-6 text-xs text-slate-600 leading-relaxed">
              <p className="font-semibold text-blue-900 mb-1">Privacy Guarantee:</p>
              Please note that our team cannot access, inspect, or restore your files. Because all processing is client-side, your document data does not exist on our servers.
            </div>
          </div>
        </div>

        {/* Support FAQ */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={SUPPORT_FAQS} />
        </div>
      </Container>
    </main>
  );
}
