import { Metadata } from 'next';
import { ToolItem } from './tools-data';

export const SITE_URL = 'https://pdftoolshub.com';
export const SITE_NAME = 'PDFToolsHub';

export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

export function generateToolMetadata(tool: ToolItem): Metadata {
  const canonical = getCanonicalUrl(`/tools/${tool.slug}`);
  const title = `${tool.name} — Free Online ${tool.name} | ${SITE_NAME}`;
  const ogImage = `${SITE_URL}/og/${tool.slug}.png`;

  return {
    title,
    description: tool.metaDescription,
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
          alt: `${tool.name} tool preview`,
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
          alt: `${SITE_NAME} preview`,
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
  const toolUrl = getCanonicalUrl(`/tools/${tool.slug}`);

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    url: toolUrl,
    description: tool.metaDescription,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
  };

  const faqPageSchema = {
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
        item: toolUrl,
      },
    ],
  };

  return [softwareAppSchema, faqPageSchema, breadcrumbSchema];
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
