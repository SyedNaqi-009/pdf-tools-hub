import React from 'react';

interface ToolLogoProps {
  slug: string;
  size?: number;
}

export default function ToolLogo({ slug, size = 56 }: ToolLogoProps) {
  const s = size;

  switch (slug) {
    case 'merge-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" />
          {/* Back document */}
          <rect x="22" y="12" width="26" height="34" rx="4" fill="#93C5FD" />
          {/* Front document */}
          <rect x="14" y="20" width="26" height="34" rx="4" fill="#2563EB" />
          <path d="M19 28H31M19 34H33M19 40H27" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Plus / Merge arrows circle */}
          <circle cx="44" cy="42" r="10" fill="#1D4ED8" />
          <path d="M44 37V47M39 42H49" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'split-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" />
          <rect x="12" y="14" width="18" height="36" rx="4" fill="#2563EB" />
          <rect x="34" y="14" width="18" height="36" rx="4" fill="#3B82F6" />
          <path d="M32 12V52" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
          {/* Scissors */}
          <circle cx="28" cy="46" r="3" stroke="#DC2626" strokeWidth="2" />
          <circle cx="36" cy="46" r="3" stroke="#DC2626" strokeWidth="2" />
          <path d="M29 44L35 34M35 44L29 34" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'compress-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#ECFDF5" />
          <rect x="18" y="14" width="28" height="36" rx="5" fill="#059669" />
          <path d="M24 24H38M24 30H34" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Two arrows squeezing */}
          <path d="M12 32H20M20 32L16 28M20 32L16 36" stroke="#047857" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M52 32H44M44 32L48 28M44 32L48 36" stroke="#047857" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'pdf-to-word':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" />
          {/* Red PDF */}
          <rect x="10" y="16" width="20" height="28" rx="3" fill="#DC2626" />
          <text x="14" y="34" fill="white" fontSize="9" fontWeight="900" fontFamily="sans-serif">PDF</text>
          {/* Arrow */}
          <path d="M31 30H35M35 30L33 28M35 30L33 32" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
          {/* Blue Word */}
          <rect x="36" y="20" width="20" height="28" rx="3" fill="#2563EB" />
          <text x="40" y="38" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif">W</text>
        </svg>
      );

    case 'word-to-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" />
          {/* Blue Word */}
          <rect x="10" y="16" width="20" height="28" rx="3" fill="#2563EB" />
          <text x="14" y="34" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif">W</text>
          {/* Arrow */}
          <path d="M31 30H35M35 30L33 28M35 30L33 32" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          {/* Red PDF */}
          <rect x="36" y="20" width="20" height="28" rx="3" fill="#DC2626" />
          <text x="39" y="38" fill="white" fontSize="9" fontWeight="900" fontFamily="sans-serif">PDF</text>
        </svg>
      );

    case 'pdf-to-excel':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#ECFDF5" />
          {/* Red PDF */}
          <rect x="10" y="16" width="20" height="28" rx="3" fill="#DC2626" />
          <text x="14" y="34" fill="white" fontSize="9" fontWeight="900" fontFamily="sans-serif">PDF</text>
          {/* Arrow */}
          <path d="M31 30H35M35 30L33 28M35 30L33 32" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
          {/* Green Excel */}
          <rect x="36" y="20" width="20" height="28" rx="3" fill="#059669" />
          <text x="41" y="38" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif">X</text>
        </svg>
      );

    case 'excel-to-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#ECFDF5" />
          {/* Green Excel */}
          <rect x="10" y="16" width="20" height="28" rx="3" fill="#059669" />
          <text x="15" y="34" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif">X</text>
          {/* Arrow */}
          <path d="M31 30H35M35 30L33 28M35 30L33 32" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          {/* Red PDF */}
          <rect x="36" y="20" width="20" height="28" rx="3" fill="#DC2626" />
          <text x="39" y="38" fill="white" fontSize="9" fontWeight="900" fontFamily="sans-serif">PDF</text>
        </svg>
      );

    case 'pdf-to-powerpoint':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FFF7ED" />
          {/* Red PDF */}
          <rect x="10" y="16" width="20" height="28" rx="3" fill="#DC2626" />
          <text x="14" y="34" fill="white" fontSize="9" fontWeight="900" fontFamily="sans-serif">PDF</text>
          {/* Arrow */}
          <path d="M31 30H35M35 30L33 28M35 30L33 32" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
          {/* Orange PPT */}
          <rect x="36" y="20" width="20" height="28" rx="3" fill="#EA580C" />
          <text x="41" y="38" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif">P</text>
        </svg>
      );

    case 'powerpoint-to-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FFF7ED" />
          {/* Orange PPT */}
          <rect x="10" y="16" width="20" height="28" rx="3" fill="#EA580C" />
          <text x="15" y="34" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif">P</text>
          {/* Arrow */}
          <path d="M31 30H35M35 30L33 28M35 30L33 32" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          {/* Red PDF */}
          <rect x="36" y="20" width="20" height="28" rx="3" fill="#DC2626" />
          <text x="39" y="38" fill="white" fontSize="9" fontWeight="900" fontFamily="sans-serif">PDF</text>
        </svg>
      );

    case 'pdf-to-jpg':
    case 'pdf-to-png':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FAF5FF" />
          {/* Red PDF */}
          <rect x="10" y="16" width="20" height="28" rx="3" fill="#DC2626" />
          <text x="14" y="34" fill="white" fontSize="9" fontWeight="900" fontFamily="sans-serif">PDF</text>
          {/* Arrow */}
          <path d="M31 30H35M35 30L33 28M35 30L33 32" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
          {/* Photo Frame */}
          <rect x="36" y="20" width="22" height="28" rx="4" fill="#9333EA" />
          <circle cx="43" cy="28" r="2.5" fill="#FDE047" />
          <path d="M38 42L44 34L50 42" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'jpg-to-pdf':
    case 'png-to-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FAF5FF" />
          {/* Photo Frame */}
          <rect x="10" y="16" width="22" height="28" rx="4" fill="#9333EA" />
          <circle cx="17" cy="24" r="2.5" fill="#FDE047" />
          <path d="M12 38L18 30L24 38" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Arrow */}
          <path d="M33 30H37M37 30L35 28M37 30L35 32" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          {/* Red PDF */}
          <rect x="38" y="20" width="20" height="28" rx="3" fill="#DC2626" />
          <text x="41" y="38" fill="white" fontSize="9" fontWeight="900" fontFamily="sans-serif">PDF</text>
        </svg>
      );

    case 'translate-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#F0F9FF" />
          <rect x="14" y="14" width="24" height="32" rx="4" fill="#0284C7" />
          <text x="21" y="34" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif">A</text>
          <rect x="28" y="22" width="24" height="32" rx="4" fill="#2563EB" />
          <text x="34" y="44" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif">文</text>
          <path d="M22 10C35 10 44 19 44 32" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
        </svg>
      );

    case 'rotate-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" />
          <rect x="22" y="18" width="22" height="30" rx="3" fill="#2563EB" />
          <path d="M48 30C48 20.0589 39.9411 12 30 12C21.7157 12 14.7735 17.6256 12.6953 25" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          <path d="M17 26H12V21" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'protect-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FEF3C7" />
          <rect x="16" y="14" width="24" height="34" rx="4" fill="#D97706" />
          {/* Lock */}
          <rect x="26" y="28" width="22" height="18" rx="4" fill="#F59E0B" />
          <path d="M31 28V23C31 19.6863 33.6863 17 37 17C40.3137 17 43 19.6863 43 23V28" stroke="#F59E0B" strokeWidth="3" />
          <circle cx="37" cy="36" r="2.5" fill="#78350F" />
        </svg>
      );

    case 'unlock-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FEF3C7" />
          <rect x="16" y="14" width="24" height="34" rx="4" fill="#D97706" />
          {/* Open Lock */}
          <rect x="26" y="30" width="22" height="18" rx="4" fill="#10B981" />
          <path d="M31 22V20C31 16.6863 33.6863 14 37 14C40.3137 14 43 16.6863 43 20" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
          <circle cx="37" cy="38" r="2.5" fill="white" />
        </svg>
      );

    case 'sign-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" />
          <rect x="14" y="14" width="28" height="36" rx="4" fill="#2563EB" />
          <path d="M20 22H32M20 28H36" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Cursive Signature */}
          <path d="M18 42C21 40 23 44 26 41C29 38 33 42 37 40" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
          {/* Pen */}
          <path d="M48 16L52 20L36 36L32 37L33 33L48 16Z" fill="#1E40AF" stroke="#60A5FA" strokeWidth="1.5" />
        </svg>
      );

    case 'pdf-watermark':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FEF2F2" />
          <rect x="16" y="14" width="26" height="36" rx="4" fill="#94A3B8" />
          {/* Red Stamp */}
          <rect x="14" y="28" width="36" height="14" rx="3" transform="rotate(-15 14 28)" fill="#EF4444" fillOpacity="0.2" stroke="#DC2626" strokeWidth="2" />
          <text x="21" y="38" fill="#DC2626" fontSize="8" fontWeight="bold" fontFamily="sans-serif" transform="rotate(-15 21 38)">STAMP</text>
        </svg>
      );

    case 'organize-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#F5F3FF" />
          <rect x="14" y="14" width="15" height="20" rx="3" fill="#6366F1" />
          <rect x="35" y="14" width="15" height="20" rx="3" fill="#3B82F6" />
          <rect x="14" y="38" width="15" height="18" rx="3" fill="#10B981" />
          <rect x="35" y="38" width="15" height="18" rx="3" fill="#F59E0B" />
        </svg>
      );

    case 'extract-pdf-pages':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" />
          <rect x="14" y="20" width="22" height="30" rx="4" fill="#94A3B8" />
          {/* Extracted floating page with arrow */}
          <rect x="28" y="12" width="22" height="30" rx="4" fill="#2563EB" />
          <path d="M34 22H44M34 28H42" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 14L28 8M28 8H23M28 8V13" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'delete-pdf-pages':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FEF2F2" />
          <rect x="18" y="14" width="28" height="36" rx="4" fill="#94A3B8" />
          <circle cx="44" cy="42" r="10" fill="#DC2626" />
          <path d="M40 38L48 46M48 38L40 46" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'pdf-thumbnail-generator':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#F5F3FF" />
          <rect x="14" y="16" width="36" height="32" rx="4" fill="#8B5CF6" />
          <circle cx="24" cy="26" r="3" fill="#FDE047" />
          <path d="M18 42L28 32L38 42" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'fill-pdf-forms':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#F0FDF4" />
          <rect x="16" y="14" width="32" height="36" rx="4" fill="#15803D" />
          <rect x="22" y="22" width="6" height="6" rx="1" fill="#DCFCE7" />
          <path d="M23 25L25 27L28 23" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M32 25H42M32 33H42" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <rect x="22" y="31" width="6" height="6" rx="1" fill="#DCFCE7" />
        </svg>
      );

    case 'pdf-metadata-viewer':
    case 'pdf-metadata-remover':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#F8FAFC" />
          <rect x="16" y="14" width="28" height="36" rx="4" fill="#475569" />
          <path d="M22 24H34M22 30H32" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="40" r="8" fill="#0EA5E9" />
          <path d="M46 46L52 52" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
          <circle cx="40" cy="40" r="4" fill="white" />
        </svg>
      );

    case 'pdf-preview':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#F0FDF4" />
          <rect x="16" y="14" width="32" height="36" rx="4" fill="#10B981" />
          {/* Eye */}
          <path d="M22 32C22 32 26 24 32 24C38 24 42 32 42 32C42 32 38 40 32 40C26 40 22 32 22 32Z" fill="white" />
          <circle cx="32" cy="32" r="4" fill="#065F46" />
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" />
          <rect x="18" y="14" width="28" height="36" rx="4" fill="#2563EB" />
          <path d="M24 24H38M24 30H34" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}

