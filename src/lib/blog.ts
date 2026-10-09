import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPostMeta {
  title: string;
  description: string;
  date: string;
  author: string;
  readingTime: string;
  tags: string[];
  featuredImage?: string;
  slug: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_CONTENT_DIR)) return [];
  const files = fs.readdirSync(BLOG_CONTENT_DIR);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getAllBlogPosts(): BlogPostMeta[] {
  const slugs = getAllBlogSlugs();
  const posts = slugs
    .map((slug) => {
      const fullPath = path.join(BLOG_CONTENT_DIR, `${slug}.mdx`);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || 'Untitled Post',
        description: data.description || '',
        date: data.date || new Date().toISOString().split('T')[0],
        author: data.author || 'PDFToolsHub Editorial Team',
        readingTime: data.readingTime || '5 min read',
        tags: data.tags || ['PDF Guide'],
        featuredImage: data.featuredImage || `/og/${slug}.png`,
      } as BlogPostMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(BLOG_CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || 'Untitled Post',
    description: data.description || '',
    date: data.date || new Date().toISOString().split('T')[0],
    author: data.author || 'PDFToolsHub Editorial Team',
    readingTime: data.readingTime || '5 min read',
    tags: data.tags || ['PDF Guide'],
    featuredImage: data.featuredImage || `/og/${slug}.png`,
    content,
  };
}
