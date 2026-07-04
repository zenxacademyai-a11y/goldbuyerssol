/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Phone, Globe, Menu, X, Lock, FileText, LayoutDashboard, ChevronDown } from "lucide-react";
import { Language, translations } from "../lib/translations.js";
import InstallWebAppButton from "./InstallWebAppButton.js";

interface HeaderProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  activeView: "home" | "blog" | "admin" | "about" | "contact" | "branches";
  setView: (view: "home" | "blog" | "admin" | "about" | "contact" | "branches") => void;
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

  const handleNav = (view: "home" | "blog" | "admin" | "about" | "contact" | "branches") => {
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
    <header className="sticky top-0 z-50 bg-white/95 border-b border-neutral-200/80 backdrop-blur-md shadow-sm">
      {/* Upper Rates/Ticker Bar */}
      <div className="hidden md:flex justify-between items-center px-6 py-2 bg-neutral-950 text-xs border-b border-amber-500/10 text-amber-400 font-mono">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE COLOMBO MARKET:
          </span>
          <span>24K: LKR {todayRate24k.toLocaleString()}/g</span>
          <span>22K: LKR {todayRate22k.toLocaleString()}/g</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-neutral-400">Call Desk (9 AM - 6 PM):</span>
          <a href="tel:0718321321" className="text-amber-400 hover:text-amber-300 transition-colors font-bold">
            0718 321 321
          </a>
        </div>
      </div>

      {/* Main Luxury Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer min-w-0" onClick={() => handleNav("home")}>
            {/* High-Resolution Luxury Gold Logo Image */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (onLogoClick) onLogoClick();
              }}
              className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border border-amber-500/30 shadow-md hover:brightness-110 active:scale-95 transition-all shrink-0 bg-neutral-900 flex items-center justify-center"
            >
              <img 
                src="/logo_exact.jpg" 
                alt="GBC Colombo Logo" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <h1 className="text-neutral-950 font-serif font-black text-sm sm:text-base md:text-lg tracking-wide hover:text-amber-600 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                {t.fullName}
              </h1>
              <p className="text-[9px] sm:text-[10px] text-amber-600 font-mono uppercase tracking-widest hidden sm:block whitespace-nowrap overflow-hidden text-ellipsis">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => handleNav("home")}
              className={`text-sm font-semibold tracking-wide transition-colors ${
                activeView === "home" ? "text-amber-600 font-bold" : "text-neutral-600 hover:text-amber-600"
              }`}
            >
              {t.home}
            </button>
            <a
              href="#rates"
              onClick={() => handleNav("home")}
              className="text-sm font-semibold tracking-wide text-neutral-600 hover:text-amber-600 transition-colors"
            >
              {t.rates}
            </a>
            <a
              href="#calculator"
              onClick={() => handleNav("home")}
              className="text-sm font-semibold tracking-wide text-neutral-600 hover:text-amber-600 transition-colors"
            >
              {t.calculator}
            </a>
            
            {/* More Menu Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setMoreMenuOpen(true)}
              onMouseLeave={() => setMoreMenuOpen(false)}
            >
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1 py-2 focus:outline-none ${
                  ["about", "blog", "contact", "admin", "branches"].includes(activeView)
                    ? "text-amber-600 font-bold"
                    : "text-neutral-600 hover:text-amber-600"
                }`}
              >
                <span>{getMoreText(currentLang)}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${moreMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 rounded-xl bg-white border border-neutral-200 shadow-xl overflow-hidden z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => {
                      handleNav("about");
                      setMoreMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center gap-2 ${
                      activeView === "about"
                        ? "bg-amber-500/10 text-amber-600 font-bold"
                        : "text-neutral-700 hover:bg-neutral-50 hover:text-amber-600"
                    }`}
                  >
                    <span>{t.about}</span>
                  </button>
                  <button
                    onClick={() => {
                      handleNav("branches");
                      setMoreMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center gap-2 ${
                      activeView === "branches"
                        ? "bg-amber-500/10 text-amber-600 font-bold"
                        : "text-neutral-700 hover:bg-neutral-50 hover:text-amber-600"
                    }`}
                  >
                    <span>{t.branches}</span>
                  </button>
                  <button
                    onClick={() => {
                      handleNav("blog");
                      setMoreMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center gap-2 ${
                      activeView === "blog"
                        ? "bg-amber-500/10 text-amber-600 font-bold"
                        : "text-neutral-700 hover:bg-neutral-50 hover:text-amber-600"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span>{t.blog}</span>
                  </button>
                  <button
                    onClick={() => {
                      handleNav("contact");
                      setMoreMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center gap-2 ${
                      activeView === "contact"
                        ? "bg-amber-500/10 text-amber-600 font-bold"
                        : "text-neutral-700 hover:bg-neutral-50 hover:text-amber-600"
                    }`}
                  >
                    <span>{t.contact}</span>
                  </button>
                  {showAdmin && (
                    <button
                      onClick={() => {
                        handleNav("admin");
                        setMoreMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center gap-2 border-t border-neutral-100 ${
                        activeView === "admin"
                          ? "bg-amber-500/10 text-amber-600 font-bold"
                          : "text-neutral-700 hover:bg-neutral-50 hover:text-amber-600"
                      }`}
                    >
                      <Lock className="h-3.5 w-3.5 shrink-0" />
                      <span>{t.admin}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Buttons (Language + Call CTAs) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Web App Installer */}
            <InstallWebAppButton currentLang={currentLang} variant="header" />

            {/* Language Selection */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 text-xs text-neutral-700 hover:text-amber-600 border border-neutral-200 px-3 py-1.5 rounded-full transition-colors bg-white shadow-sm"
              >
                <Globe className="h-3.5 w-3.5 text-amber-500" />
                <span>{getLangName(currentLang)}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-md bg-white border border-neutral-200 shadow-xl overflow-hidden z-50">
                  <div className="py-1">
                    {(["en", "si", "ta"] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLang(lang);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                          currentLang === lang
                            ? "bg-amber-500/10 text-amber-600 font-semibold"
                            : "text-neutral-700 hover:bg-neutral-50"
                        }`}
                      >
                        {getLangName(lang)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Premium Gold Call Button */}
            <a
              href="tel:0718321321"
              id="header_cta_call"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black px-4 py-2.5 rounded-md text-xs font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/15"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>0718 321 321</span>
            </a>
          </div>

          {/* Mobile Right Controls (Lang + Menu) */}
          <div className="flex md:hidden items-center gap-3">
            {/* Lang Button Cycles through languages directly on mobile for ease of touch */}
            <button
              onClick={() => {
                const nextLang: Language =
                  currentLang === "en" ? "si" : currentLang === "si" ? "ta" : "en";
                setLang(nextLang);
              }}
              className="flex items-center gap-1 text-xs text-neutral-700 border border-neutral-200 px-2 py-1 rounded-full bg-white shadow-sm"
            >
              <Globe className="h-3 w-3 text-amber-500" />
              <span>{currentLang.toUpperCase()}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-700 hover:text-amber-600 transition-colors p-1"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 border-b border-neutral-200 absolute left-0 right-0 py-6 px-4 flex flex-col gap-4 shadow-2xl z-40 animate-in fade-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => handleNav("home")}
            className={`text-left text-base py-2 border-b border-neutral-100 ${
              activeView === "home" ? "text-amber-600 font-bold" : "text-neutral-700"
            }`}
          >
            {t.home}
          </button>
          <button
            onClick={() => handleNav("about")}
            className={`text-left text-base py-2 border-b border-neutral-100 ${
              activeView === "about" ? "text-amber-600 font-bold" : "text-neutral-700"
            }`}
          >
            {t.about}
          </button>
          <a
            href="#rates"
            onClick={() => setMobileMenuOpen(false)}
            className="text-left text-base py-2 border-b border-neutral-100 text-neutral-700 hover:text-amber-600"
          >
            {t.rates}
          </a>
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="text-left text-base py-2 border-b border-neutral-100 text-neutral-700 hover:text-amber-600"
          >
            {t.calculator}
          </a>
          <button
            onClick={() => handleNav("blog")}
            className={`text-left text-base py-2 border-b border-neutral-100 flex items-center gap-2 ${
              activeView === "blog" ? "text-amber-600 font-bold" : "text-neutral-700"
            }`}
          >
            <FileText className="h-4 w-4 text-amber-500" />
            {t.blog}
          </button>
          <button
            onClick={() => handleNav("contact")}
            className={`text-left text-base py-2 border-b border-neutral-100 ${
              activeView === "contact" ? "text-amber-600 font-bold" : "text-neutral-700"
            }`}
          >
            {t.contact}
          </button>
          <button
            onClick={() => handleNav("branches")}
            className={`text-left text-base py-2 border-b border-neutral-100 ${
              activeView === "branches" ? "text-amber-600 font-bold" : "text-neutral-700"
            }`}
          >
            {t.branches}
          </button>
          {showAdmin && (
            <button
              onClick={() => handleNav("admin")}
              className={`text-left text-base py-2 border-b border-neutral-100 flex items-center gap-2 ${
                activeView === "admin" ? "text-amber-600 font-bold" : "text-neutral-700"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 text-amber-500" />
              {t.admin}
            </button>
          )}

          {/* PWA Installer inside drawer */}
          <div className="pt-4 border-t border-neutral-150">
            <InstallWebAppButton currentLang={currentLang} variant="header" />
          </div>

          {/* Quick CTAs inside drawer */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <a
              href="tel:0718321321"
              id="drawer_cta_call"
              className="flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-250 border border-neutral-200 text-neutral-900 p-3 rounded-md text-xs font-bold text-center"
            >
              <Phone className="h-3.5 w-3.5 text-amber-500" />
              <span>0718 321 321</span>
            </a>
            <a
              href="https://wa.me/94718321321"
              target="_blank"
              rel="noreferrer"
              id="drawer_cta_wa"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-md text-xs font-bold text-center"
            >
              {/* WhatsApp custom text styling/icon */}
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
