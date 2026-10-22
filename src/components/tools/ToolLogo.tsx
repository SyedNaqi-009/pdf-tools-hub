import React from 'react';

interface ToolLogoProps {
  slug: string;
  size?: number;
}

export default function ToolLogo({ slug, size = 60 }: ToolLogoProps) {
  const s = size;

  switch (slug) {
    // =========================================================================
    // CONVERTERS: PDF <-> OFFICE FORMATS (FREEPDFCONVERT STYLE)
    // =========================================================================
    case 'pdf-to-word':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="1.5" />
          {/* Main Word Document */}
          <path d="M16 12C16 10.3431 17.3431 9 19 9H39L49 19V49C49 50.6569 47.6569 52 46 52H19C17.3431 52 16 50.6569 16 49V12Z" fill="#2563EB" />
          <path d="M39 9V17C39 18.1046 39.8954 19 41 19H49L39 9Z" fill="#1D4ED8" />
          {/* Word "W" Emblem */}
          <rect x="20" y="24" width="16" height="16" rx="3" fill="#1D4ED8" />
          <path d="M23 27L25 35L28 29L31 35L33 27" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Document Content Lines */}
          <path d="M22 45H36M39 27H43M39 32H43" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
          {/* Input Format Tag: PDF */}
          <rect x="33" y="37" width="22" height="16" rx="4" fill="#DC2626" stroke="white" strokeWidth="1.5" />
          <text x="36" y="49" fill="white" fontSize="8" fontWeight="900" fontFamily="sans-serif">PDF</text>
        </svg>
      );

    case 'word-to-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FEF2F2" stroke="#FEE2E2" strokeWidth="1.5" />
          {/* Main Crimson PDF Document */}
          <path d="M16 12C16 10.3431 17.3431 9 19 9H39L49 19V49C49 50.6569 47.6569 52 46 52H19C17.3431 52 16 50.6569 16 49V12Z" fill="#DC2626" />
          <path d="M39 9V17C39 18.1046 39.8954 19 41 19H49L39 9Z" fill="#B91C1C" />
          {/* PDF Ribbon */}
          <text x="21" y="35" fill="white" fontSize="11" fontWeight="900" fontFamily="sans-serif">PDF</text>
          <path d="M21 41H43M21 45H35" stroke="white" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round" />
          {/* Input DOC Badge */}
          <rect x="31" y="14" width="24" height="15" rx="3.5" fill="#2563EB" stroke="white" strokeWidth="1.5" />
          <text x="34" y="25" fill="white" fontSize="8" fontWeight="900" fontFamily="sans-serif">DOC</text>
        </svg>
      );

    case 'pdf-to-excel':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#ECFDF5" stroke="#D1FAE5" strokeWidth="1.5" />
          {/* Main Emerald Excel Document */}
          <path d="M16 12C16 10.3431 17.3431 9 19 9H39L49 19V49C49 50.6569 47.6569 52 46 52H19C17.3431 52 16 50.6569 16 49V12Z" fill="#059669" />
          <path d="M39 9V17C39 18.1046 39.8954 19 41 19H49L39 9Z" fill="#047857" />
          {/* Spreadsheet Table Grid */}
          <rect x="21" y="24" width="22" height="16" rx="2" fill="#047857" stroke="white" strokeWidth="1.2" />
          <path d="M21 32H43M32 24V40" stroke="white" strokeWidth="1.2" />
          <path d="M22 46H36" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
          {/* PDF Input Tag */}
          <rect x="33" y="37" width="22" height="16" rx="4" fill="#DC2626" stroke="white" strokeWidth="1.5" />
          <text x="36" y="49" fill="white" fontSize="8" fontWeight="900" fontFamily="sans-serif">PDF</text>
        </svg>
      );

    case 'excel-to-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FEF2F2" stroke="#FEE2E2" strokeWidth="1.5" />
          {/* Main Crimson PDF */}
          <path d="M16 12C16 10.3431 17.3431 9 19 9H39L49 19V49C49 50.6569 47.6569 52 46 52H19C17.3431 52 16 50.6569 16 49V12Z" fill="#DC2626" />
          <path d="M39 9V17C39 18.1046 39.8954 19 41 19H49L39 9Z" fill="#B91C1C" />
          <text x="21" y="35" fill="white" fontSize="11" fontWeight="900" fontFamily="sans-serif">PDF</text>
          <path d="M21 41H43M21 45H35" stroke="white" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round" />
          {/* XLS Badge */}
          <rect x="31" y="14" width="24" height="15" rx="3.5" fill="#059669" stroke="white" strokeWidth="1.5" />
          <text x="35" y="25" fill="white" fontSize="8" fontWeight="900" fontFamily="sans-serif">XLS</text>
        </svg>
      );

    case 'pdf-to-powerpoint':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FFF7ED" stroke="#FFEDD5" strokeWidth="1.5" />
          {/* Main Orange PPT */}
          <path d="M16 12C16 10.3431 17.3431 9 19 9H39L49 19V49C49 50.6569 47.6569 52 46 52H19C17.3431 52 16 50.6569 16 49V12Z" fill="#EA580C" />
          <path d="M39 9V17C39 18.1046 39.8954 19 41 19H49L39 9Z" fill="#C2410C" />
          {/* Presentation Slide Chart */}
          <rect x="21" y="24" width="22" height="15" rx="2" fill="#C2410C" stroke="white" strokeWidth="1.2" />
          <circle cx="32" cy="31" r="4.5" fill="#FDBA74" />
          <path d="M32 31L34.5 27.5M32 31H36.5" stroke="#C2410C" strokeWidth="1.2" />
          <path d="M22 46H36" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
          {/* PDF Input Tag */}
          <rect x="33" y="37" width="22" height="16" rx="4" fill="#DC2626" stroke="white" strokeWidth="1.5" />
          <text x="36" y="49" fill="white" fontSize="8" fontWeight="900" fontFamily="sans-serif">PDF</text>
        </svg>
      );

    case 'powerpoint-to-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FEF2F2" stroke="#FEE2E2" strokeWidth="1.5" />
          {/* Main Crimson PDF */}
          <path d="M16 12C16 10.3431 17.3431 9 19 9H39L49 19V49C49 50.6569 47.6569 52 46 52H19C17.3431 52 16 50.6569 16 49V12Z" fill="#DC2626" />
          <path d="M39 9V17C39 18.1046 39.8954 19 41 19H49L39 9Z" fill="#B91C1C" />
          <text x="21" y="35" fill="white" fontSize="11" fontWeight="900" fontFamily="sans-serif">PDF</text>
          <path d="M21 41H43M21 45H35" stroke="white" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round" />
          {/* PPT Badge */}
          <rect x="31" y="14" width="24" height="15" rx="3.5" fill="#EA580C" stroke="white" strokeWidth="1.5" />
          <text x="35" y="25" fill="white" fontSize="8" fontWeight="900" fontFamily="sans-serif">PPT</text>
        </svg>
      );

    case 'pdf-to-jpg':
    case 'pdf-to-png':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FAF5FF" stroke="#F3E8FF" strokeWidth="1.5" />
          {/* Photographic Frame */}
          <rect x="15" y="14" width="34" height="34" rx="5" fill="#7C3AED" stroke="#6D28D9" strokeWidth="1.5" />
          <circle cx="24" cy="23" r="3.5" fill="#FDE047" />
          <path d="M19 41L27 29L35 37L39 31L45 41H19Z" fill="#A78BFA" />
          {/* PDF Tag */}
          <rect x="33" y="37" width="22" height="16" rx="4" fill="#DC2626" stroke="white" strokeWidth="1.5" />
          <text x="36" y="49" fill="white" fontSize="8" fontWeight="900" fontFamily="sans-serif">PDF</text>
        </svg>
      );

    case 'jpg-to-pdf':
    case 'png-to-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FEF2F2" stroke="#FEE2E2" strokeWidth="1.5" />
          {/* Main Crimson PDF */}
          <path d="M16 12C16 10.3431 17.3431 9 19 9H39L49 19V49C49 50.6569 47.6569 52 46 52H19C17.3431 52 16 50.6569 16 49V12Z" fill="#DC2626" />
          <path d="M39 9V17C39 18.1046 39.8954 19 41 19H49L39 9Z" fill="#B91C1C" />
          <text x="21" y="35" fill="white" fontSize="11" fontWeight="900" fontFamily="sans-serif">PDF</text>
          <path d="M21 41H43M21 45H35" stroke="white" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round" />
          {/* IMG Badge */}
          <rect x="31" y="14" width="24" height="15" rx="3.5" fill="#7C3AED" stroke="white" strokeWidth="1.5" />
          <text x="34" y="25" fill="white" fontSize="8" fontWeight="900" fontFamily="sans-serif">IMG</text>
        </svg>
      );

    // =========================================================================
    // CORE MANIPULATION SUITE (MERGE, SPLIT, COMPRESS, ROTATE)
    // =========================================================================
    case 'merge-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="1.5" />
          {/* Back document */}
          <rect x="23" y="10" width="26" height="34" rx="4" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1.2" />
          {/* Front document */}
          <rect x="15" y="18" width="26" height="34" rx="4" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.2" />
          <path d="M21 26H35M21 32H33M21 38H28" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Plus / Merge arrows circle */}
          <circle cx="43" cy="41" r="11" fill="#10B981" stroke="white" strokeWidth="2" />
          <path d="M43 36V46M38 41H48" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'split-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="1.5" />
          {/* Left Split Page */}
          <rect x="12" y="12" width="18" height="38" rx="4" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.2" />
          <path d="M16 20H24M16 26H22M16 32H25" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          {/* Right Split Page */}
          <rect x="34" y="12" width="18" height="38" rx="4" fill="#3B82F6" stroke="#2563EB" strokeWidth="1.2" />
          <path d="M38 20H46M38 26H44M38 32H47" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          {/* Cut Line */}
          <path d="M32 10V54" stroke="#DC2626" strokeWidth="2" strokeDasharray="3 3" />
          {/* Scissors */}
          <circle cx="28" cy="45" r="3.5" fill="none" stroke="#DC2626" strokeWidth="2" />
          <circle cx="36" cy="45" r="3.5" fill="none" stroke="#DC2626" strokeWidth="2" />
          <path d="M29 42L35 33M35 42L29 33" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'compress-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#ECFDF5" stroke="#D1FAE5" strokeWidth="1.5" />
          {/* Center Document */}
          <rect x="20" y="12" width="24" height="38" rx="5" fill="#059669" stroke="#047857" strokeWidth="1.2" />
          <path d="M25 22H39M25 28H35M25 34H38" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Squeeze Inward Clamp Arrows */}
          <path d="M10 31H19M19 31L15 27M19 31L15 35" stroke="#047857" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M54 31H45M45 31L49 27M45 31L49 35" stroke="#047857" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Save Size Tag */}
          <circle cx="32" cy="42" r="4" fill="#34D399" />
          <path d="M30 42L31.5 43.5L34 40.5" stroke="#064E3B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'rotate-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="1.5" />
          {/* Document Center */}
          <rect x="22" y="16" width="20" height="30" rx="3.5" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.2" />
          <path d="M26 24H38M26 30H36" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          {/* Sweeping 360 Rotation Arrow */}
          <path d="M50 30C50 19.5066 41.4934 11 31 11C21.6076 11 13.8242 17.8489 12.2539 26.8" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          <path d="M17.5 28H11.5V22" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // =========================================================================
    // SECURITY & SIGNATURE SUITE
    // =========================================================================
    case 'protect-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.5" />
          {/* Background Document */}
          <rect x="15" y="11" width="24" height="34" rx="4" fill="#D97706" />
          {/* Solid Golden Padlock */}
          <rect x="24" y="27" width="26" height="23" rx="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          {/* Shackle */}
          <path d="M30 27V21C30 17.134 33.134 14 37 14C40.866 14 44 17.134 44 21V27" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
          {/* Keyhole */}
          <circle cx="37" cy="36" r="3" fill="#78350F" />
          <path d="M37 39V43" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'unlock-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#ECFDF5" stroke="#D1FAE5" strokeWidth="1.5" />
          {/* Background Document */}
          <rect x="15" y="11" width="24" height="34" rx="4" fill="#059669" />
          {/* Unlocked Green Padlock */}
          <rect x="24" y="29" width="26" height="23" rx="5" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
          {/* Open Shackle */}
          <path d="M30 21V19C30 15.134 33.134 12 37 12C40.866 12 44 15.134 44 19" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" />
          {/* Keyhole */}
          <circle cx="37" cy="38" r="3" fill="white" />
          <path d="M37 41V45" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'sign-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="1.5" />
          {/* Main Contract Document */}
          <rect x="14" y="11" width="30" height="40" rx="4" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.2" />
          <path d="M20 19H36M20 25H38M20 31H32" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Cursive Signature Line */}
          <path d="M19 43C22 41 24 45 27 42C30 39 34 43 38 41" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
          {/* Fountain Pen */}
          <path d="M50 13L54 17L37 35L32 36L33 31L50 13Z" fill="#1E40AF" stroke="#93C5FD" strokeWidth="1.8" />
        </svg>
      );

    // =========================================================================
    // INTELLIGENCE & LANGUAGE
    // =========================================================================
    case 'translate-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#F0F9FF" stroke="#E0F2FE" strokeWidth="1.5" />
          {/* Card 1: Latin 'A' */}
          <rect x="13" y="14" width="24" height="32" rx="5" fill="#0284C7" stroke="#0369A1" strokeWidth="1.2" />
          <text x="20" y="36" fill="white" fontSize="18" fontWeight="900" fontFamily="sans-serif">A</text>
          {/* Card 2: CJK '文' */}
          <rect x="27" y="22" width="24" height="32" rx="5" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.2" />
          <text x="33" y="45" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">文</text>
          {/* Connection Arch */}
          <path d="M24 10C36 10 45 19 45 32" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>
      );

    // =========================================================================
    // UTILITY & WORKFLOW TOOLS
    // =========================================================================
    case 'organize-pdf':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#F5F3FF" stroke="#EDE9FE" strokeWidth="1.5" />
          <rect x="13" y="13" width="16" height="21" rx="3" fill="#6366F1" />
          <rect x="35" y="13" width="16" height="21" rx="3" fill="#3B82F6" />
          <rect x="13" y="38" width="16" height="19" rx="3" fill="#10B981" />
          <rect x="35" y="38" width="16" height="19" rx="3" fill="#F59E0B" />
          {/* Reorder Arrows */}
          <path d="M31 23H33M31 47H33" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'extract-pdf-pages':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="1.5" />
          <rect x="14" y="20" width="22" height="32" rx="4" fill="#94A3B8" stroke="#64748B" strokeWidth="1.2" />
          {/* Extracted Floating Page */}
          <rect x="28" y="12" width="23" height="32" rx="4" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />
          <path d="M34 21H45M34 27H43M34 33H40" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Pop-out indicator */}
          <path d="M22 14L28 8M28 8H23M28 8V13" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'delete-pdf-pages':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FEF2F2" stroke="#FEE2E2" strokeWidth="1.5" />
          <rect x="16" y="12" width="28" height="38" rx="4" fill="#94A3B8" stroke="#64748B" strokeWidth="1.2" />
          <path d="M22 22H36M22 28H34" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Red Delete Badge */}
          <circle cx="43" cy="41" r="11" fill="#DC2626" stroke="white" strokeWidth="2" />
          <path d="M39 37L47 45M47 37L39 45" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'pdf-thumbnail-generator':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#F5F3FF" stroke="#EDE9FE" strokeWidth="1.5" />
          <rect x="13" y="14" width="38" height="34" rx="5" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="1.2" />
          <circle cx="23" cy="24" r="3.5" fill="#FDE047" />
          <path d="M17 42L27 31L37 42" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="36" y="34" width="18" height="15" rx="3" fill="#A78BFA" stroke="white" strokeWidth="1.5" />
        </svg>
      );

    case 'fill-pdf-forms':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#F0FDF4" stroke="#DCFCE7" strokeWidth="1.5" />
          <rect x="15" y="12" width="34" height="40" rx="4" fill="#15803D" stroke="#166534" strokeWidth="1.2" />
          {/* Checkboxes */}
          <rect x="21" y="20" width="7" height="7" rx="1.5" fill="#DCFCE7" />
          <path d="M22 23.5L24 25.5L27 21.5" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M32 23H43" stroke="white" strokeWidth="2" strokeLinecap="round" />
          
          <rect x="21" y="31" width="7" height="7" rx="1.5" fill="#DCFCE7" />
          <path d="M22 34.5L24 36.5L27 32.5" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M32 34H43" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'pdf-watermark':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#FEF2F2" stroke="#FEE2E2" strokeWidth="1.5" />
          <rect x="15" y="12" width="28" height="38" rx="4" fill="#94A3B8" stroke="#64748B" strokeWidth="1.2" />
          <path d="M21 20H35M21 26H31" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Red Stamp */}
          <rect x="13" y="27" width="38" height="15" rx="3.5" transform="rotate(-15 13 27)" fill="#EF4444" fillOpacity="0.25" stroke="#DC2626" strokeWidth="2" />
          <text x="18" y="38" fill="#DC2626" fontSize="9" fontWeight="900" fontFamily="sans-serif" transform="rotate(-15 18 38)">STAMP</text>
        </svg>
      );

    case 'pdf-metadata-viewer':
    case 'pdf-metadata-remover':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="15" y="12" width="28" height="38" rx="4" fill="#475569" stroke="#334155" strokeWidth="1.2" />
          <path d="M21 22H35M21 28H31" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Magnifier */}
          <circle cx="41" cy="40" r="9" fill="#0EA5E9" stroke="white" strokeWidth="2" />
          <path d="M48 47L54 53" stroke="#0EA5E9" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="41" cy="40" r="4.5" fill="white" />
        </svg>
      );

    case 'pdf-preview':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#F0FDF4" stroke="#DCFCE7" strokeWidth="1.5" />
          <rect x="15" y="12" width="34" height="40" rx="4" fill="#10B981" stroke="#059669" strokeWidth="1.2" />
          {/* Eye Icon */}
          <path d="M22 32C22 32 26 23 32 23C38 23 42 32 42 32C42 32 38 41 32 41C26 41 22 32 22 32Z" fill="white" />
          <circle cx="32" cy="32" r="4.5" fill="#065F46" />
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="1.5" />
          <rect x="17" y="12" width="30" height="40" rx="4" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.2" />
          <path d="M23 22H39M23 28H35" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
