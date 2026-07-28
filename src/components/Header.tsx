/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Phone, 
  Globe, 
  Menu, 
  X, 
  Lock, 
  FileText, 
  LayoutDashboard, 
  ChevronDown,
  Sparkles,
  MapPin,
  Calculator,
  TrendingUp,
  HelpCircle,
  Building2,
  Info
} from "lucide-react";
import { Language, translations } from "../lib/translations.js";
import { ThemeToggle } from "./ThemeToggle.js";

interface HeaderProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  activeView: "home" | "blog" | "admin" | "about" | "contact" | "branches" | "rates" | "calculator" | "faq" | "services";
  setView: (view: "home" | "blog" | "admin" | "about" | "contact" | "branches" | "rates" | "calculator" | "faq" | "services") => void;
  todayRate24k: number;
  todayRate22k: number;
  showAdmin?: boolean;
  onLogoClick?: () => void;
}

export default function Header({
  currentLang,
  setLang,
  activeView,
  setView,
  todayRate24k,
  todayRate22k,
  showAdmin = false,
  onLogoClick,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const t = translations[currentLang];

  const handleNav = (view: "home" | "blog" | "admin" | "about" | "contact" | "branches" | "rates" | "calculator" | "faq" | "services") => {
    setView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getLangName = (code: Language) => {
    switch (code) {
      case "en":
        return "English";
      case "si":
        return "සිංහල";
      case "ta":
        return "தமிழ்";
    }
  };

  const getMoreText = (lang: Language) => {
    switch (lang) {
      case "si":
        return "තවත්";
      case "ta":
        return "மேலும்";
      default:
        return "More";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-neutral-950/95 border-b border-neutral-200/90 dark:border-neutral-800/90 backdrop-blur-xl shadow-xs transition-colors duration-200">
      {/* Upper Ticker Bar: High Contrast & Readability */}
      <div className="bg-neutral-950 text-amber-400 border-b border-amber-500/20 px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] sm:text-xs font-mono">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          
          {/* Live Market Rates Badge */}
          <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-1 min-[420px]:gap-3 shrink min-w-0">
            <span className="inline-flex items-center gap-1.5 font-bold text-amber-400 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs">LIVE MARKET:</span>
            </span>

            <div className="hidden sm:flex items-center gap-4 text-neutral-200 font-semibold">
              <span className="bg-neutral-900 border border-amber-500/30 px-2 py-0.5 rounded text-amber-300">
                24K: <strong className="text-white">LKR {todayRate24k.toLocaleString()}/g</strong>
              </span>
              <span className="bg-neutral-900 border border-amber-500/30 px-2 py-0.5 rounded text-amber-300">
                22K: <strong className="text-white">LKR {todayRate22k.toLocaleString()}/g</strong>
              </span>
            </div>

            <div className="sm:hidden flex items-center gap-2 text-[10px] min-[380px]:text-[11px] text-amber-300 font-bold whitespace-nowrap">
              <span className="bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">24K: LKR {todayRate24k.toLocaleString()}</span>
              <span className="bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">22K: LKR {todayRate22k.toLocaleString()}</span>
            </div>
          </div>

          {/* Direct Desk Call Hotline */}
          <div className="hidden md:flex items-center gap-4 shrink-0 text-xs font-semibold">
            <span className="text-neutral-400 font-sans">Desk (9 AM - 6 PM):</span>
            <a 
              href="tel:0718321321" 
              className="text-amber-400 hover:text-amber-300 transition-colors font-bold flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md"
            >
              <Phone className="h-3 w-3 text-amber-400" />
              <span>0718 321 321</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Luxury Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center gap-4">
          
          {/* Brand Logo & Name */}
          <a 
            href="/" 
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer min-w-0 no-underline group py-1" 
            onClick={(e) => { e.preventDefault(); handleNav("home"); }}
          >
            {/* High-Resolution Luxury Gold Logo */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (onLogoClick) onLogoClick();
              }}
              className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-2 border-amber-500/40 shadow-md group-hover:border-amber-400 group-hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 bg-neutral-950 flex items-center justify-center"
            >
              <img 
                fetchPriority="high" 
                decoding="async" 
                src="/gbc-logo-original.png" 
                alt="Gold Buyers Colombo Logo" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="min-w-0 flex flex-col justify-center">
              <h1 className="text-neutral-950 dark:text-white font-serif font-black text-sm sm:text-base md:text-lg tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors whitespace-nowrap overflow-hidden text-ellipsis m-0 leading-tight">
                {t.fullName}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400 font-mono font-bold uppercase tracking-wider hidden sm:block whitespace-nowrap overflow-hidden text-ellipsis m-0 mt-0.5">
                {t.tagline}
              </p>
            </div>
          </a>

          {/* Desktop Navigation Items */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <a 
              href="/"
              onClick={(e) => { e.preventDefault(); handleNav("home"); }}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                activeView === "home" 
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shadow-2xs" 
                  : "text-neutral-700 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              }`}
            >
              {t.home}
            </a>

            <a
              href="/services"
              onClick={(e) => { e.preventDefault(); handleNav("services"); }}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                activeView === "services" 
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shadow-2xs" 
                  : "text-neutral-700 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              }`}
            >
              {t.services}
            </a>

            <a
              href="/rates"
              onClick={(e) => { e.preventDefault(); handleNav("rates"); }}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                activeView === "rates" 
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shadow-2xs" 
                  : "text-neutral-700 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              }`}
            >
              {t.rates}
            </a>

            <a
              href="/calculator"
              onClick={(e) => { e.preventDefault(); handleNav("calculator"); }}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                activeView === "calculator" 
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shadow-2xs" 
                  : "text-neutral-700 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              }`}
            >
              {t.calculator}
            </a>

            {/* "More" Dropdown Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setMoreMenuOpen(true)}
              onMouseLeave={() => setMoreMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 flex items-center gap-1 focus:outline-none ${
                  ["about", "blog", "contact", "admin", "branches", "faq"].includes(activeView)
                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shadow-2xs"
                    : "text-neutral-700 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                }`}
              >
                <span>{getMoreText(currentLang)}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${moreMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-52 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xl overflow-hidden z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <a
                    href="/about"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav("about");
                      setMoreMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2.5 ${
                      activeView === "about"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-amber-600 dark:hover:text-amber-400"
                    }`}
                  >
                    <Info className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>{t.about}</span>
                  </a>

                  <a
                    href="/branches"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav("branches");
                      setMoreMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2.5 ${
                      activeView === "branches"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-amber-600 dark:hover:text-amber-400"
                    }`}
                  >
                    <Building2 className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>{t.branches}</span>
                  </a>

                  <a
                    href="/blog"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav("blog");
                      setMoreMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2.5 ${
                      activeView === "blog"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-amber-600 dark:hover:text-amber-400"
                    }`}
                  >
                    <FileText className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>{t.blog}</span>
                  </a>

                  <a
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav("contact");
                      setMoreMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2.5 ${
                      activeView === "contact"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-amber-600 dark:hover:text-amber-400"
                    }`}
                  >
                    <MapPin className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>{t.contact}</span>
                  </a>

                  <a
                    href="/faq"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav("faq");
                      setMoreMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2.5 ${
                      activeView === "faq"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-amber-600 dark:hover:text-amber-400"
                    }`}
                  >
                    <HelpCircle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>{t.faq}</span>
                  </a>

                  {showAdmin && (
                    <a
                      href="/admin"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNav("admin");
                        setMoreMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2.5 border-t border-neutral-100 dark:border-neutral-800 ${
                        activeView === "admin"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-amber-600 dark:hover:text-amber-400"
                      }`}
                    >
                      <Lock className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>{t.admin}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Controls (Theme, Language, Call CTA) */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {/* Language Selection */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400 border border-neutral-200 dark:border-neutral-800 px-3 py-2 rounded-xl transition-colors bg-white dark:bg-neutral-900 shadow-2xs hover:shadow-sm"
              >
                <Globe className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>{getLangName(currentLang)}</span>
                <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden z-50 p-1">
                  {(["en", "si", "ta"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLang(lang);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs rounded-xl font-bold transition-colors ${
                        currentLang === lang
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {getLangName(lang)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Premium Gold Call Button */}
            <a
              href="tel:0718321321"
              id="header_cta_call"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-amber-500 text-neutral-950 px-4 py-2.5 rounded-xl text-xs font-black transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-amber-500/20 no-underline cursor-pointer"
            >
              <Phone className="h-3.5 w-3.5 fill-neutral-950" />
              <span>0718 321 321</span>
            </a>
          </div>

          {/* Mobile Safe Controls (Language Direct Cycle + Drawer Toggle) */}
          <div className="flex md:hidden items-center gap-2.5">
            <ThemeToggle />

            {/* Mobile Direct Language Toggle */}
            <button
              onClick={() => {
                const nextLang: Language =
                  currentLang === "en" ? "si" : currentLang === "si" ? "ta" : "en";
                setLang(nextLang);
              }}
              className="flex items-center gap-1 text-xs font-extrabold text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 px-2.5 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 shadow-2xs active:scale-95 transition-transform"
              aria-label="Change Language"
            >
              <Globe className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>{currentLang.toUpperCase()}</span>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6 text-amber-600" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay with High Legibility & Safe Zones */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[calc(4rem+25px)] sm:top-[calc(5rem+25px)] bg-white/98 dark:bg-neutral-950/98 border-b border-amber-500/20 backdrop-blur-2xl px-5 py-6 flex flex-col gap-3 shadow-2xl z-40 max-h-[80vh] overflow-y-auto pb-24 animate-in fade-in slide-in-from-top-4 duration-200">
          
          <div className="text-[10px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold mb-1">
            Navigation Menu
          </div>

          <a
            href="/"
            onClick={(e) => { e.preventDefault(); handleNav("home"); }}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-bold transition-colors ${
              activeView === "home" 
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20" 
                : "text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            <span>{t.home}</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </a>

          <a
            href="/services"
            onClick={(e) => { e.preventDefault(); handleNav("services"); }}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-bold transition-colors ${
              activeView === "services" 
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20" 
                : "text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            <span>{t.services}</span>
          </a>

          <a
            href="/rates"
            onClick={(e) => { e.preventDefault(); handleNav("rates"); }}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-bold transition-colors ${
              activeView === "rates" 
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20" 
                : "text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            <span>{t.rates}</span>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </a>

          <a
            href="/calculator"
            onClick={(e) => { e.preventDefault(); handleNav("calculator"); }}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-bold transition-colors ${
              activeView === "calculator" 
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20" 
                : "text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            <span>{t.calculator}</span>
            <Calculator className="h-4 w-4 text-amber-500" />
          </a>

          <a
            href="/about"
            onClick={(e) => { e.preventDefault(); handleNav("about"); }}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-bold transition-colors ${
              activeView === "about" 
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20" 
                : "text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            <span>{t.about}</span>
          </a>

          <a
            href="/branches"
            onClick={(e) => { e.preventDefault(); handleNav("branches"); }}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-bold transition-colors ${
              activeView === "branches" 
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20" 
                : "text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            <span>{t.branches}</span>
            <Building2 className="h-4 w-4 text-amber-500" />
          </a>

          <a
            href="/blog"
            onClick={(e) => { e.preventDefault(); handleNav("blog"); }}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-bold transition-colors ${
              activeView === "blog" 
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20" 
                : "text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            <span>{t.blog}</span>
            <FileText className="h-4 w-4 text-amber-500" />
          </a>

          <a
            href="/contact"
            onClick={(e) => { e.preventDefault(); handleNav("contact"); }}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-bold transition-colors ${
              activeView === "contact" 
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20" 
                : "text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            <span>{t.contact}</span>
            <MapPin className="h-4 w-4 text-amber-500" />
          </a>

          <a
            href="/faq"
            onClick={(e) => { e.preventDefault(); handleNav("faq"); }}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-bold transition-colors ${
              activeView === "faq" 
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20" 
                : "text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            <span>{t.faq}</span>
          </a>

          {showAdmin && (
            <a
              href="/admin"
              onClick={(e) => { e.preventDefault(); handleNav("admin"); }}
              className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-bold transition-colors border-t border-neutral-200 dark:border-neutral-800 mt-1 ${
                activeView === "admin" 
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" 
                  : "text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              }`}
            >
              <span>{t.admin}</span>
              <LayoutDashboard className="h-4 w-4 text-amber-500" />
            </a>
          )}

          {/* Quick Drawer Action CTAs */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 mt-2">
            <a
              href="tel:0718321321"
              id="drawer_cta_call"
              className="flex items-center justify-center gap-2 bg-neutral-900 dark:bg-neutral-800 text-white p-3 rounded-xl text-xs font-bold text-center no-underline active:scale-95 transition-transform"
            >
              <Phone className="h-4 w-4 text-amber-400" />
              <span>0718 321 321</span>
            </a>
            <a
              href="https://wa.me/94718321321"
              target="_blank"
              rel="noreferrer"
              id="drawer_cta_wa"
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white p-3 rounded-xl text-xs font-bold text-center no-underline active:scale-95 transition-transform"
            >
              <span>WhatsApp Chat</span>
            </a>
          </div>

        </div>
      )}
    </header>
  );
}
