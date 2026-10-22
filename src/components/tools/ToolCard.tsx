import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ToolItem } from '@/lib/tools-data';
import ToolLogo from './ToolLogo';

interface ToolCardProps {
  tool: ToolItem;
  variant?: 'grid' | 'compact' | 'featured';
}

export default function ToolCard({ tool, variant = 'grid' }: ToolCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        href={`/tools/${tool.slug}`}
        className="group flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-3.5 transition-all hover:border-blue-500 hover:shadow-md"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="shrink-0 group-hover:scale-105 transition-transform duration-200">
            <ToolLogo slug={tool.slug} size={42} />
          </div>
          <div className="min-w-0">
            <span className="truncate text-sm font-bold text-zinc-900 group-hover:text-blue-600 block">
              {tool.name}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              .{tool.outputExtension.toUpperCase()} OUT
            </span>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-transform" />
      </Link>
    );
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl"
    >
      <div>
        {/* Top Header: iLovePDF Style Tool Logo & Badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="group-hover:scale-105 transition-transform duration-200 drop-shadow-xs">
            <ToolLogo slug={tool.slug} size={54} />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.tier === 1 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-blue-700 border border-blue-200/60 uppercase">
                <Sparkles className="h-2.5 w-2.5 text-blue-600" />
                POPULAR
              </span>
            )}
            <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-200 uppercase">
              .{tool.outputExtension}
            </span>
          </div>
        </div>

        {/* Title & Short Description */}
        <h3 className="text-lg font-black text-zinc-900 group-hover:text-blue-600 transition-colors">
          {tool.name}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-6 border-t border-zinc-100 pt-3.5 flex items-center justify-between text-xs font-semibold text-zinc-500 group-hover:text-zinc-900">
        <span className="font-mono text-[11px] text-zinc-400">100% Free · No Upload</span>
        <span className="inline-flex items-center gap-1 font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
          Open Tool
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
