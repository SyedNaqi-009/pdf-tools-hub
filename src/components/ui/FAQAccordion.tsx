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
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <details
          key={index}
          className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 open:border-blue-200 open:shadow-xs"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900 focus:outline-hidden">
            <span className="text-base sm:text-lg pr-4">{item.question}</span>
            <span className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform duration-200 group-open:rotate-180 group-open:bg-blue-50 group-open:text-blue-600">
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
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
