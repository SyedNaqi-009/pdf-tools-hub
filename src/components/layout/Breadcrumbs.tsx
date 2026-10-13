import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`text-xs text-zinc-500 font-mono ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <li>
          <Link
            href="/"
            className="text-zinc-500 hover:text-rose-600 transition-colors uppercase font-medium"
          >
            STUDIO
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-zinc-300">/</span>
              {isLast || !item.href ? (
                <span className="font-bold text-zinc-900 truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-zinc-500 hover:text-rose-600 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
