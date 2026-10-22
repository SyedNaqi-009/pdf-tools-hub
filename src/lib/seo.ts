import { Metadata } from 'next';
import { ToolItem } from './tools-data';

export const SITE_URL = 'https://www.dopdfconverter.online';
export const SITE_NAME = 'dopdf';

export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

export function generateToolMetadata(tool: ToolItem): Metadata {
  const canonical = getCanonicalUrl(`/tools/${tool.slug}`);
  const title = `${tool.name} — Free Online ${tool.name} | ${SITE_NAME}`;
  const ogImage = `${SITE_URL}/og/${tool.slug}.png`;

  const keywords = [
    tool.name.toLowerCase(),
    `free ${tool.name.toLowerCase()}`,
    `${tool.name.toLowerCase()} online`,
    'dopdf',
    'free pdf converter',
    'convert pdf online',
    tool.slug.replace(/-/g, ' '),
  ];

  return {
    title,
    description: tool.metaDescription,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: tool.metaDescription,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${tool.name} tool preview - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: tool.metaDescription,
      images: [ogImage],
    },
  };
}

export function generatePageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = getCanonicalUrl(path);
  const fullTitle = `${title} | ${SITE_NAME}`;
  const ogImage = `${SITE_URL}/og/default.png`;

  return {
    title: fullTitle,
    description,
    keywords: [
      'dopdf',
      'pdf converter',
      'free pdf converter online',
      'pdf tools',
      'convert pdf to word',
      'pdf to jpg',
      'merge pdf',
      'compress pdf',
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function getToolStructuredData(tool: ToolItem) {
  const canonical = getCanonicalUrl(`/tools/${tool.slug}`);

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${tool.name} - ${SITE_NAME}`,
    url: canonical,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All (Web Browser)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: tool.metaDescription,
    featureList: tool.features,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1680',
      bestRating: '5',
      worstRating: '1',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'PDF Tools',
        item: `${SITE_URL}/tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: canonical,
      },
    ],
  };

  return [softwareAppSchema, faqSchema, breadcrumbSchema];
}

export function getHomeStructuredData() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/tools?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [],
  };

  return [websiteSchema, orgSchema];
}

export function getArticleStructuredData(post: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
  featuredImage?: string;
}) {
  const postUrl = getCanonicalUrl(`/blog/${post.slug}`);
  const imageUrl = post.featuredImage
    ? `${SITE_URL}${post.featuredImage}`
    : `${SITE_URL}/og/${post.slug}.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    url: postUrl,
    image: imageUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  };
}
