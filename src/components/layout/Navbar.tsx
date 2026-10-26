'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  ArrowRight, 
  FileText,
  Shield,
  Sparkles,
} from 'lucide-react';
import { TOOLS, TOOL_CATEGORIES } from '@/lib/tools-data';
import ToolLogo from '@/components/tools/ToolLogo';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState<Record<string, boolean>>({
    convert: true,
    core: false,
    utility: false,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 15);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown and drawer when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const toggleMobileCategory = (catId: string) => {
    setIsMobileCategoryOpen((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const navLinks = [
    { label: 'All Tools', href: '/tools', badge: '27' },
    { label: 'Guides & Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-zinc-950/90 text-white shadow-lg backdrop-blur-md border-b border-zinc-800/80'
          : 'bg-zinc-950 text-white border-b border-zinc-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 sm:h-18 items-center justify-between gap-4">
          
          {/* Brand Logo & Engine Indicator */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="DoPDF Home"
            >
              <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/navbar-logo.webp"
                  alt="DoPDF Logo"
                  width={56}
                  height={56}
                  priority
                  className="h-full w-full object-contain drop-shadow-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
                  Do<span className="text-blue-500">PDF</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-300 font-bold tracking-wider flex items-center gap-1.5 mt-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  FREE PDF CONVERTER
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            <Link
              href="/"
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/'
                  ? 'text-rose-400 bg-rose-950/40 border border-rose-900/50'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>

            {/* Mega Dropdown for PDF Tools (Click to Toggle) */}
            <div
              className="static"
              ref={dropdownRef}
            >
              <button
                type="button"
                onClick={() => setIsDropdownOpen((v) => !v)}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  pathname.startsWith('/tools')
                    ? 'text-rose-400 bg-rose-950/40 border border-rose-900/50'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
                aria-expanded={isDropdownOpen}
              >
                <span>Tool Suite</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-rose-400' : 'text-zinc-500'
                  }`}
                />
              </button>

              {/* Mega Menu Dropdown Panel */}
              {isDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[calc(100vw-2rem)] max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl ring-1 ring-white/10 transition-all z-50 text-zinc-100">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-rose-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                        27 Client-Side Document Utilities
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700">
                      ZERO-TELEMETRY SANDBOX
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {TOOL_CATEGORIES.map((category) => {
                      const categoryTools = TOOLS.filter((t) => t.category === category.id);
                      return (
                        <div key={category.id} className="space-y-3">
                          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                              {category.label}
                            </h3>
                            <span className="text-[10px] font-mono text-zinc-500">
                              {categoryTools.length}
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {categoryTools.map((tool) => (
                              <li key={tool.slug}>
                                <Link
                                  href={`/tools/${tool.slug}`}
                                  className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="shrink-0 group-hover:scale-105 transition-transform">
                                      <ToolLogo slug={tool.slug} size={22} />
                                    </span>
                                    <span className="truncate">{tool.name}</span>
                                  </div>
                                  {tool.tier === 1 && (
                                    <span className="ml-1 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 border border-blue-900 uppercase shrink-0">
                                      HOT
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 border-t border-zinc-800 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-emerald-400" />
                      100% In-Memory Browser Execution. Zero Uploads.
                    </span>
                    <Link
                      href="/tools"
                      className="inline-flex items-center gap-1.5 font-bold text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      <span>Explore Complete Directory</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 ${
                  pathname === link.href
                    ? 'text-rose-400 bg-rose-950/40 border border-rose-900/50'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action: Quick Action + Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/tools"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition-colors uppercase tracking-wider"
            >
              <span>PDF Tools</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 md:hidden"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xs md:hidden transition-opacity touch-none overscroll-contain"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer (Slide-out) */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-[320px] sm:max-w-sm bg-zinc-950 text-white border-l border-zinc-800 shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col overscroll-contain ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-5 shrink-0">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 text-base font-bold text-white"
          >
            <div className="relative flex h-11 w-11 items-center justify-center">
              <Image
                src="/navbar-logo.webp"
                alt="DoPDF Logo"
                width={44}
                height={44}
                priority
                className="h-full w-full object-contain drop-shadow-md"
              />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Do<span className="text-blue-500">PDF</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
            aria-label="Close Menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-5">
          {/* Mobile Home Link */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg ${
              pathname === '/' ? 'bg-rose-950 text-rose-400 border border-rose-900' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          {/* Categorized Tools in Mobile (iLovePDF Style - Images 2 & 3) */}
          <div className="space-y-6 pt-1">
            {TOOL_CATEGORIES.map((cat) => {
              const categoryTools = TOOLS.filter((t) => t.category === cat.id);
              return (
                <div key={cat.id} className="space-y-2">
                  <div className="px-2 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800/80 pb-1.5 flex items-center justify-between">
                    <span>{cat.label}</span>
                    <span className="text-[10px] text-zinc-500 font-normal">{categoryTools.length}</span>
                  </div>
                  <div className="space-y-1">
                    {categoryTools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group flex items-center gap-3 rounded-xl px-2.5 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-900 hover:text-white transition-colors"
                      >
                        <span className="shrink-0 group-hover:scale-105 transition-transform drop-shadow-xs">
                          <ToolLogo slug={tool.slug} size={28} />
                        </span>
                        <span className="truncate">{tool.name}</span>
                        {tool.tier === 1 && (
                          <span className="ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900 uppercase">
                            HOT
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            <Link
              href="/tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-blue-950/60 border border-blue-900/60 text-xs font-bold text-blue-400 hover:bg-blue-900/60 transition-colors"
            >
              <span>View All 27 Tools Directory →</span>
            </Link>
          </div>

          <div className="border-t border-zinc-800 pt-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg ${
                  pathname === link.href
                    ? 'bg-rose-950 text-rose-400 border border-rose-900'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-800 p-5 bg-zinc-900/50">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <Shield className="h-4 w-4 shrink-0" />
            <span>100% In-Memory. No cloud tracking.</span>
          </div>
        </div>
      </div>
    </header>
  );
}
