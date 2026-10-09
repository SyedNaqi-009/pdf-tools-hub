import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pdftoolshub.com'),
  title: {
    default: 'Free Online PDF Tools — No Upload Required | PDFToolsHub',
    template: '%s | PDFToolsHub',
  },
  description:
    'Merge, compress, convert, edit, and sign PDF files directly in your browser. 100% private, client-side processing, zero server uploads, and completely free.',
  keywords: [
    'PDF tools',
    'merge PDF',
    'compress PDF',
    'PDF to Word',
    'split PDF',
    'convert PDF',
    'sign PDF',
    'free PDF editor',
    'client side PDF',
  ],
  authors: [{ name: 'PDFToolsHub' }],
  creator: 'PDFToolsHub',
  publisher: 'PDFToolsHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pdftoolshub.com',
    siteName: 'PDFToolsHub',
    title: 'Free Online PDF Tools — No Upload Required | PDFToolsHub',
    description:
      'Merge, compress, convert, edit, and sign PDF files directly in your browser. 100% private, client-side processing, zero server uploads, and completely free.',
    images: [
      {
        url: 'https://pdftoolshub.com/og/default.png',
        width: 1200,
        height: 630,
        alt: 'PDFToolsHub Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online PDF Tools — No Upload Required | PDFToolsHub',
    description:
      'Merge, compress, convert, edit, and sign PDF files directly in your browser. 100% private with zero server uploads.',
    images: ['https://pdftoolshub.com/og/default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased text-slate-900 bg-white">
        {/* Skip to Content for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg focus:outline-hidden"
        >
          Skip to main content
        </a>

        <Navbar />
        <div id="main-content" className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
