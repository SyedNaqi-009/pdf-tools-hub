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
  metadataBase: new URL('https://www.dopdfconverter.online'),
  title: {
    default: 'Free PDF Converter Online | dopdf',
    template: '%s | dopdf',
  },
  description:
    'Convert PDF files online with easy-to-use tools for supported formats. Explore PDF converters and useful PDF utilities in one convenient place.',
  keywords: [
    'dopdf',
    'free PDF converter',
    'PDF converter online',
    'PDF to Word',
    'Word to PDF',
    'translate PDF',
    'PDF language converter',
    'merge PDF',
    'compress PDF',
    'split PDF',
    'convert PDF',
    'sign PDF',
    'client side PDF',
  ],
  authors: [{ name: 'dopdf' }],
  creator: 'dopdf',
  publisher: 'dopdf',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.dopdfconverter.online',
    siteName: 'dopdf',
    title: 'Free PDF Converter Online | dopdf',
    description:
      'Convert PDF files online with easy-to-use tools for supported formats. Explore PDF converters and useful PDF utilities in one convenient place.',
    images: [
      {
        url: 'https://www.dopdfconverter.online/og/default.png',
        width: 1200,
        height: 630,
        alt: 'dopdf Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PDF Converter Online | dopdf',
    description:
      'Convert PDF files online with easy-to-use tools for supported formats. Explore PDF converters and useful PDF utilities in one convenient place.',
    images: ['https://www.dopdfconverter.online/og/default.png'],
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
      <body className="min-h-screen flex flex-col font-sans antialiased text-zinc-950 bg-zinc-50">
        {/* Skip to Content for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-lg focus:outline-hidden"
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
