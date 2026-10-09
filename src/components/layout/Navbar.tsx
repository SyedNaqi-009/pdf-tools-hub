'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Menu, X, ChevronDown, ChevronRight, Layers, ArrowRight } from 'lucide-react';
import { TOOLS, TOOL_CATEGORIES } from '@/lib/tools-data';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState<Record<string, boolean>>({
    core: true,
    convert: false,
    utility: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown and drawer when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  const toggleMobileCategory = (catId: string) => {
    setIsMobileCategoryOpen((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const navLinks = [
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 shadow-xs backdrop-blur-md border-b border-slate-200'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Always-visible Mobile Home Icon */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group"
              aria-label="PDFToolsHub Home"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs group-hover:bg-blue-700 transition-colors">
                <Layers className="h-5 w-5" />
              </span>
              <span>
                PDF<span className="text-blue-600">Tools</span>Hub
              </span>
            </Link>

            {/* Mobile Home Quick Icon - Always visible on mobile */}
            <Link
              href="/"
              className={`md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors ${
                pathname === '/' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-50'
              }`}
              title="Home"
              aria-label="Go to Home"
            >
              <Home className="h-4 w-4" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                pathname === '/'
                  ? 'text-blue-600 bg-blue-50/80'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            {/* Mega Dropdown for PDF Tools */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsDropdownOpen((v) => !v)}
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                  pathname.startsWith('/tools')
                    ? 'text-blue-600 bg-blue-50/80'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
                aria-expanded={isDropdownOpen}
              >
                <span>PDF Tools</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Mega Menu Dropdown Panel */}
              {isDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[720px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-slate-900/5 transition-all">
                  <div className="grid grid-cols-3 gap-6">
                    {TOOL_CATEGORIES.map((category) => {
                      const categoryTools = TOOLS.filter((t) => t.category === category.id);
                      return (
                        <div key={category.id} className="space-y-3">
                          <div className="border-b border-slate-100 pb-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              {category.label}
                            </h3>
                          </div>
                          <ul className="space-y-1">
                            {categoryTools.slice(0, 7).map((tool) => (
                              <li key={tool.slug}>
                                <Link
                                  href={`/tools/${tool.slug}`}
                                  className="group flex items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                  <span className="truncate">{tool.name}</span>
                                  {tool.tier === 1 && (
                                    <span className="ml-1 text-[10px] font-semibold text-orange-500 uppercase">
                                      Hot
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

                  <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      All 26 tools process 100% in your browser. Zero server uploads.
                    </span>
                    <Link
                      href="/tools"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <span>View All Tools</span>
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
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                  pathname === link.href
                    ? 'text-blue-600 bg-blue-50/80'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Right Controls: Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Slide-out) */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 md:hidden flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 text-lg font-bold text-slate-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Layers className="h-4 w-4" />
            </span>
            <span>
              PDF<span className="text-blue-600">Tools</span>Hub
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
            aria-label="Close Menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Mobile Home Link */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 text-base font-semibold rounded-lg ${
              pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>

          {/* Categorized Tools Accordion in Mobile */}
          <div className="space-y-2">
            <div className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              PDF Tools
            </div>
            {TOOL_CATEGORIES.map((cat) => {
              const isOpen = isMobileCategoryOpen[cat.id];
              const categoryTools = TOOLS.filter((t) => t.category === cat.id);
              return (
                <div key={cat.id} className="rounded-lg border border-slate-100 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleMobileCategory(cat.id)}
                    className="flex w-full items-center justify-between bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800"
                  >
                    <span>{cat.label}</span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="bg-white p-2 space-y-1">
                      {categoryTools.map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block rounded-md px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <Link
              href="/tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-blue-600 hover:underline"
            >
              <span>Browse All 26 Tools →</span>
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 text-base font-semibold rounded-lg ${
                  pathname === link.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 p-6 bg-slate-50">
          <p className="text-xs text-slate-500 text-center">
            🔒 100% Client-Side. No uploads, no servers.
          </p>
        </div>
      </div>
    </header>
  );
}
