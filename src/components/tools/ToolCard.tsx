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
  ArrowRight,
  LucideIcon,
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
        className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 transition-all hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-xs"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            <IconComponent className="h-4.5 w-4.5" />
          </div>
          <span className="truncate text-sm font-semibold text-slate-800 group-hover:text-blue-600">
            {tool.name}
          </span>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-transform" />
      </Link>
    );
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            <IconComponent className="h-6 w-6" />
          </div>
          {tool.tier === 1 && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              Popular
            </span>
          )}
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {tool.name}
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
        <span>Use Tool</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
