import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { BlogPostMeta } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPostMeta;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-zinc-900 hover:shadow-xl">
      <div>
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-500 mb-4 font-mono">
          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2.5 py-1 text-[11px] font-bold text-zinc-800 uppercase">
            <BookOpen className="h-3 w-3 text-rose-600" />
            {post.tags[0] || 'GUIDE'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <time dateTime={post.date}>{post.date}</time>
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 group-hover:text-rose-600 transition-colors line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>

        <p className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </div>

      <div className="mt-7 border-t border-zinc-100 pt-4 flex items-center justify-between text-xs">
        <span className="font-mono text-zinc-400 font-medium">By {post.author}</span>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 font-bold text-rose-600 group-hover:text-rose-700 uppercase font-mono tracking-wider"
        >
          <span>Read Article</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
