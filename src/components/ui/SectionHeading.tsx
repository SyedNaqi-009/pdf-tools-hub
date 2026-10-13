import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  badge,
  centered = false,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`mb-10 sm:mb-14 ${centered ? 'text-center mx-auto' : ''} ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 mb-3 border border-zinc-800 ${centered ? 'mx-auto' : ''}`}>
          <span>{badge}</span>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm sm:text-base text-zinc-600 max-w-3xl leading-relaxed ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
