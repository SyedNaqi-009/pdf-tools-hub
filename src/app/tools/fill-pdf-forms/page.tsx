import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-data';
import { generateToolMetadata } from '@/lib/seo';
import ToolPageLayout from '@/components/tools/ToolPageLayout';

export function generateMetadata() {
  const tool = getToolBySlug('fill-pdf-forms');
  if (!tool) notFound();
  return generateToolMetadata(tool);
}

export default function ToolPage() {
  const tool = getToolBySlug('fill-pdf-forms');
  if (!tool) notFound();
  return <ToolPageLayout tool={tool} />;
}
