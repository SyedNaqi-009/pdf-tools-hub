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
    'Convert PDF files online with easy-to-use tools for supported formats. Explore PDF converters and useful PDF utilities in one convenient place with zero server uploads.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/logo.png' },
    ],
  },
  keywords: [
    'dopdf',
    'dopdfconverter',
    'dopdf online',
    'free PDF converter online',
    'best PDF converter 2026',
    'PDF to Word converter free',
    'Word to PDF converter',
    'translate PDF online',
    'PDF language translator',
    'merge PDF online free',
    'compress PDF without losing quality',
    'split PDF pages free',
    'PDF to JPG high resolution',
    'JPG to PDF maker',
    'PDF to Excel converter',
    'Excel to PDF',
    'sign PDF online free',
    'password protect PDF',
    'unlock PDF password remover',
    'edit PDF online free no watermark',
    'client side private PDF tools',
    'no upload PDF converter',
    '#dopdf',
    '#pdfconverter',
    '#freepdf',
    '#pdftoword',
    '#mergepdf',
    '#compresspdf',
    '#translatepdf',
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
        url: 'https://www.dopdfconverter.online/logo.png',
        width: 1024,
        height: 1024,
        alt: 'dopdf Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PDF Converter Online | dopdf',
    description:
      'Convert PDF files online with easy-to-use tools for supported formats. Explore PDF converters and useful PDF utilities in one convenient place.',
    images: ['https://www.dopdfconverter.online/logo.png'],
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
  other: {
    'geo.region': 'US',
    'geo.placename': 'Global',
    'geo.position': '37.7749;-122.4194',
    'ICBM': '37.7749, -122.4194',
    'rating': 'general',
    'distribution': 'global',
    'revisit-after': '1 days',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased text-zinc-950 bg-zinc-50">
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
