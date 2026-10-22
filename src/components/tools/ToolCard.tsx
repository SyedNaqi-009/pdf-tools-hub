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

interface ToolVisualTheme {
  gradient: string;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
  iconBg: string;
  label: string;
  glow: string;
}

function getToolVisualTheme(slug: string): ToolVisualTheme {
  switch (slug) {
    case 'pdf-to-word':
    case 'word-to-pdf':
      return {
        gradient: 'from-blue-600 via-blue-500 to-indigo-600',
        badgeBg: 'bg-blue-500/10 border-blue-500/20',
        badgeText: 'text-blue-600',
        accentColor: 'text-blue-600',
        iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/30',
        label: 'DOCX WORD',
        glow: 'group-hover:border-blue-500 group-hover:shadow-blue-500/10',
      };
    case 'pdf-to-excel':
    case 'excel-to-pdf':
      return {
        gradient: 'from-emerald-600 via-teal-500 to-green-600',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
        badgeText: 'text-emerald-600',
        accentColor: 'text-emerald-600',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30',
        label: 'XLSX SHEET',
        glow: 'group-hover:border-emerald-500 group-hover:shadow-emerald-500/10',
      };
    case 'pdf-to-powerpoint':
    case 'powerpoint-to-pdf':
      return {
        gradient: 'from-orange-500 via-amber-500 to-red-500',
        badgeBg: 'bg-orange-500/10 border-orange-500/20',
        badgeText: 'text-orange-600',
        accentColor: 'text-orange-600',
        iconBg: 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-orange-500/30',
        label: 'PPTX SLIDES',
        glow: 'group-hover:border-orange-500 group-hover:shadow-orange-500/10',
      };
    case 'pdf-to-jpg':
    case 'jpg-to-pdf':
    case 'pdf-to-png':
    case 'png-to-pdf':
    case 'pdf-thumbnail-generator':
      return {
        gradient: 'from-violet-600 via-purple-500 to-fuchsia-600',
        badgeBg: 'bg-purple-500/10 border-purple-500/20',
        badgeText: 'text-purple-600',
        accentColor: 'text-purple-600',
        iconBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-purple-500/30',
        label: 'PHOTO / IMAGE',
        glow: 'group-hover:border-purple-500 group-hover:shadow-purple-500/10',
      };
    case 'translate-pdf':
      return {
        gradient: 'from-cyan-500 via-sky-500 to-blue-600',
        badgeBg: 'bg-cyan-500/10 border-cyan-500/20',
        badgeText: 'text-cyan-700',
        accentColor: 'text-cyan-600',
        iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-500/30',
        label: '50+ LANGUAGES',
        glow: 'group-hover:border-cyan-500 group-hover:shadow-cyan-500/10',
      };
    case 'compress-pdf':
      return {
        gradient: 'from-emerald-500 via-emerald-600 to-teal-700',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
        badgeText: 'text-emerald-700',
        accentColor: 'text-emerald-600',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30',
        label: 'UP TO -85%',
        glow: 'group-hover:border-emerald-500 group-hover:shadow-emerald-500/10',
      };
    case 'merge-pdf':
    case 'split-pdf':
    case 'organize-pdf':
    case 'extract-pdf-pages':
    case 'delete-pdf-pages':
    case 'rotate-pdf':
      return {
        gradient: 'from-blue-600 via-indigo-600 to-violet-600',
        badgeBg: 'bg-blue-500/10 border-blue-500/20',
        badgeText: 'text-blue-600',
        accentColor: 'text-blue-600',
        iconBg: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/30',
        label: 'PAGE ENGINE',
        glow: 'group-hover:border-blue-500 group-hover:shadow-blue-500/10',
      };
    case 'protect-pdf':
    case 'unlock-pdf':
    case 'sign-pdf':
    case 'pdf-watermark':
      return {
        gradient: 'from-amber-500 via-orange-600 to-rose-600',
        badgeBg: 'bg-amber-500/10 border-amber-500/20',
        badgeText: 'text-amber-700',
        accentColor: 'text-amber-600',
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/30',
        label: 'SECURITY',
        glow: 'group-hover:border-amber-500 group-hover:shadow-amber-500/10',
      };
    default:
      return {
        gradient: 'from-blue-600 via-indigo-500 to-blue-700',
        badgeBg: 'bg-blue-500/10 border-blue-500/20',
        badgeText: 'text-blue-600',
        accentColor: 'text-blue-600',
        iconBg: 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/30',
        label: 'UTILITY',
        glow: 'group-hover:border-blue-500 group-hover:shadow-blue-500/10',
      };
  }
}

interface ToolCardProps {
  tool: ToolItem;
  variant?: 'grid' | 'compact' | 'featured';
}

export default function ToolCard({ tool, variant = 'grid' }: ToolCardProps) {
  const IconComponent = ICON_MAP[tool.iconName] || Layers;
  const theme = getToolVisualTheme(tool.slug);

  if (variant === 'compact') {
    return (
      <Link
        href={`/tools/${tool.slug}`}
        className="group flex items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-3.5 transition-all hover:border-blue-500 hover:shadow-sm"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${theme.iconBg}`}>
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
        <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-transform" />
      </Link>
    );
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${theme.glow}`}
    >
      <div>
        {/* Visual Graphic Header Banner for each tool */}
        <div
          className={`h-24 w-full rounded-xl bg-gradient-to-r ${theme.gradient} p-4 flex items-center justify-between text-white relative overflow-hidden shadow-inner mb-4`}
        >
          {/* Subtle watermark background icon */}
          <div className="absolute -right-4 -bottom-4 opacity-20 pointer-events-none scale-150">
            <IconComponent className="h-24 w-24" />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-md">
              <IconComponent className="h-6 w-6 drop-shadow-sm" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white/80 block">
                {theme.label}
              </span>
              <span className="text-sm font-black text-white drop-shadow-sm">
                .{tool.outputExtension.toUpperCase()}
              </span>
            </div>
          </div>

          <span className="relative z-10 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white uppercase tracking-wider">
            {tool.tier === 1 ? '★ POPULAR' : 'CLIENT-SIDE'}
          </span>
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
      <div className="mt-5 border-t border-zinc-100 pt-3 flex items-center justify-between text-xs font-semibold text-zinc-500 group-hover:text-zinc-950">
        <span className="font-mono text-[11px] text-zinc-400">100% Client-Side</span>
        <span className={`inline-flex items-center gap-1 font-bold ${theme.accentColor} group-hover:underline`}>
          Open Tool
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
