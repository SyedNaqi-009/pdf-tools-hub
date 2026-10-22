import React from 'react';
import Link from 'next/link';
import {
  Layers,
  Minimize2,
  FileText,
  Image,
  FileImage,
  Scissors,
  FileCheck,
  ImageIcon,
  Sheet,
  Table,
  RotateCw,
  FileCheck2,
  Trash2,
  Presentation,
  FileSpreadsheet,
  Stamp,
  Lock,
  Unlock,
  PenTool,
  FileSearch,
  FileX,
  ListOrdered,
  LayoutGrid,
  Eye,
  FileEdit,
  Languages,
  ArrowRight,
  LucideIcon,
  Sparkles,
} from 'lucide-react';
import { ToolItem } from '@/lib/tools-data';

const ICON_MAP: Record<string, LucideIcon> = {
  Layers,
  Minimize2,
  FileText,
  Image,
  FileImage,
  Scissors,
  FileCheck,
  ImageIcon,
  Sheet,
  Table,
  RotateCw,
  FileCheck2,
  Trash2,
  Presentation,
  FileSpreadsheet,
  Stamp,
  Lock,
  Unlock,
  PenTool,
  FileSearch,
  FileX,
  ListOrdered,
  LayoutGrid,
  Eye,
  FileEdit,
  Languages,
};

interface ToolCardProps {
  tool: ToolItem;
  variant?: 'grid' | 'compact' | 'featured';
}

export default function ToolCard({ tool, variant = 'grid' }: ToolCardProps) {
  const IconComponent = ICON_MAP[tool.iconName] || Layers;

  if (variant === 'compact') {
    return (
      <Link
        href={`/tools/${tool.slug}`}
        className="group flex items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-3.5 transition-all hover:border-zinc-900 hover:shadow-sm"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            <IconComponent className="h-4.5 w-4.5" />
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
        <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400 group-hover:translate-x-0.5 group-hover:text-zinc-900 transition-transform" />
      </Link>
    );
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-zinc-900 hover:shadow-lg"
    >
      <div>
        {/* Top Header Badge & Icon */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-950/20">
            <IconComponent className="h-6 w-6" />
          </div>
          
          <div className="flex items-center gap-1.5">
            {tool.tier === 1 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-blue-700 border border-blue-200/60 uppercase">
                <Sparkles className="h-2.5 w-2.5 text-blue-600" />
                POPULAR
              </span>
            )}
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200">
              .{tool.outputExtension.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Title & Short Description */}
        <h3 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
          {tool.name}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-6 border-t border-zinc-100 pt-3 flex items-center justify-between text-xs font-semibold text-zinc-500 group-hover:text-zinc-900">
        <span className="font-mono text-[11px] text-zinc-400">100% Client-Side</span>
        <span className="inline-flex items-center gap-1 font-bold text-blue-600 group-hover:text-blue-700">
          Open Tool
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
