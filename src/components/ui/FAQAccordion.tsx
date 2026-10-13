import React from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export default function FAQAccordion({ items, className = '' }: FAQAccordionProps) {
  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      {items.map((item, index) => (
        <details
          key={index}
          className="group rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 transition-all duration-200 hover:border-zinc-400 open:border-zinc-900 open:shadow-md"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-zinc-900 focus:outline-hidden">
            <div className="flex items-center gap-3 pr-4">
              <span className="font-mono text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-base sm:text-lg">{item.question}</span>
            </div>
            <span className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 transition-transform duration-200 group-open:rotate-180 group-open:bg-zinc-900 group-open:text-white">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </summary>
          <div className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-4 pl-8">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
