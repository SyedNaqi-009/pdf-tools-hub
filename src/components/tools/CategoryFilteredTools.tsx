'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { TOOLS, ToolItem } from '@/lib/tools-data';
import ToolLogo from './ToolLogo';

interface CategoryTab {
  id: string;
  label: string;
  filterFn: (tool: ToolItem) => boolean;
}

const CATEGORY_TABS: CategoryTab[] = [
  {
    id: 'convert',
    label: 'Convert PDF',
    filterFn: (t) => t.category === 'convert',
  },
  {
    id: 'all',
    label: 'All Tools',
    filterFn: () => true,
  },
  {
    id: 'organize',
    label: 'Organize PDF',
    filterFn: (t) =>
      ['merge-pdf', 'split-pdf', 'rotate-pdf', 'organize-pdf', 'extract-pdf-pages', 'delete-pdf-pages'].includes(
        t.slug
      ),
  },
  {
    id: 'optimize',
    label: 'Optimize PDF',
    filterFn: (t) => ['compress-pdf'].includes(t.slug),
  },
  {
    id: 'security',
    label: 'PDF Security',
    filterFn: (t) => ['protect-pdf', 'unlock-pdf', 'sign-pdf', 'pdf-watermark'].includes(t.slug),
  },
  {
    id: 'utility',
    label: 'Edit & Utilities',
    filterFn: (t) =>
      ['fill-pdf-forms', 'pdf-preview', 'pdf-thumbnail-generator', 'pdf-metadata-viewer', 'pdf-metadata-remover'].includes(
        t.slug
      ),
  },
];

export default function CategoryFilteredTools({ initialCategory = 'convert' }: { initialCategory?: string }) {
  const [activeTab, setActiveTab] = useState(initialCategory);

  const currentTab = CATEGORY_TABS.find((tab) => tab.id === activeTab) || CATEGORY_TABS[0];
  const filteredTools = TOOLS.filter(currentTab.filterFn);

  return (
    <div className="space-y-8">
      {/* Category Filter Pills (Image 1 Style - Horizontal scrollable on mobile, flex-wrap on desktop) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 -mx-1 sm:flex-wrap sm:justify-center">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = TOOLS.filter(tab.filterFn).length;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-zinc-950 text-white shadow-md ring-2 ring-zinc-950'
                  : 'bg-white text-zinc-700 border border-zinc-200/90 hover:border-zinc-400 hover:text-zinc-950 hover:bg-zinc-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filtered Tools Grid (Image 1 Mobile & Desktop Card Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs hover:border-blue-500 hover:shadow-xl transition-all duration-200"
          >
            <div>
              {/* Top Row: Tool Logo + Name (Image 1 Style) */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="shrink-0 group-hover:scale-105 transition-transform duration-200 drop-shadow-xs">
                  <ToolLogo slug={tool.slug} size={46} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-black text-zinc-950 group-hover:text-blue-600 transition-colors leading-tight">
                      {tool.name}
                    </h3>
                    <span className="shrink-0 text-[10px] font-mono font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-200 uppercase">
                      .{tool.outputExtension}
                    </span>
                  </div>
                  {tool.tier === 1 && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-mono font-bold text-blue-700 uppercase">
                      <Sparkles className="h-2.5 w-2.5 text-blue-600" />
                      Popular Tool
                    </span>
                  )}
                </div>
              </div>

              {/* Description (Image 1 Style) */}
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-2">
                {tool.shortDescription}
              </p>
            </div>

            {/* Bottom Action Row */}
            <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-500 group-hover:text-zinc-900">
              <span className="font-mono text-[11px] text-zinc-400">100% Free · In-Browser</span>
              <span className="inline-flex items-center gap-1 font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                Open Tool
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

