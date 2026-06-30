/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Award, ShieldCheck, Mail, Phone, MapPin, Star } from "lucide-react";
import { Language, translations } from "../lib/translations.js";

interface FooterProps {
  currentLang: Language;
  setView: (view: "home" | "blog" | "admin" | "about" | "contact") => void;
  showAdmin?: boolean;
  onLogoClick?: () => void;
}

export default function Footer({ currentLang, setView, showAdmin = false, onLogoClick }: FooterProps) {
  const t = translations[currentLang];

  return (
    <footer className="bg-white text-neutral-900 border-t border-neutral-200 pt-16 pb-28 md:pb-12 px-4 relative">
 
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        {/* Brand Column (md:col-span-5) */}
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-amber-500/30 bg-neutral-900 flex items-center justify-center shadow-md">
              <img 
                src="/logo_exact.jpg" 
                alt="GBC Colombo Logo" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-neutral-950 tracking-wider">
                {t.fullName}
              </h3>
              <p className="text-[10px] text-amber-700 uppercase tracking-widest font-mono font-bold">
                {t.tagline}
              </p>
            </div>
          </div>
 
          <p className="text-xs text-neutral-600 leading-relaxed max-w-sm">
            {t.footerDesc}
          </p>
 
          {/* Licenses badges */}
          <div className="flex gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 border border-neutral-200 px-2.5 py-1 rounded bg-neutral-50 shadow-sm">
              <Award className="h-3 w-3 text-amber-700" />
              <span>GJA COMPLIANT</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 border border-neutral-200 px-2.5 py-1 rounded bg-neutral-50 shadow-sm">
              <ShieldCheck className="h-3 w-3 text-amber-700" />
              <span>SECURED VAULT</span>
            </div>
          </div>
        </div>
 
        {/* Quick Links Column (md:col-span-3) */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-700 font-semibold">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-xs text-neutral-600">
            <li>
              <button onClick={() => setView("home")} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                {t.home}
              </button>
            </li>
            <li>
              <button onClick={() => setView("about")} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                {t.about}
              </button>
            </li>
            <li>
              <a href="#rates" onClick={() => setView("home")} className="hover:text-amber-700 transition-colors block text-left">
                {t.liveRatesTitle}
              </a>
            </li>
            <li>
              <a href="#calculator" onClick={() => setView("home")} className="hover:text-amber-700 transition-colors block text-left">
                {t.calcTitle}
              </a>
            </li>
            <li>
              <button onClick={() => setView("blog")} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                {t.blog}
              </button>
            </li>
            <li>
              <button onClick={() => setView("contact")} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                {t.contact}
              </button>
            </li>
            {showAdmin && (
              <li>
                <button onClick={() => setView("admin")} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                  {t.admin}
                </button>
              </li>
            )}
          </ul>
        </div>
 
        {/* SEO Keywords & Location (md:col-span-4) */}
        <div className="md:col-span-4 space-y-4 text-xs">
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-700 font-semibold">
            Regional Hub & SEO
          </h4>
          <p className="text-neutral-600 leading-relaxed">
            Registered office centered in Colombo, serving clients across Kollupitiya, Bambalapitiya, Wellawatte, Havelock, Dehiwala, Nugegoda, and Mount Lavinia. Highly optimized for <strong>"Gold Buyer in Colombo"</strong>.
          </p>
          
          <div className="flex items-center gap-2 text-neutral-500 mt-2">
            <MapPin className="h-4 w-4 text-amber-700 flex-shrink-0" />
            <span>Galle Road, Colombo 03, Sri Lanka</span>
          </div>
        </div>
 
      </div>
 
      {/* Footer Bottom Line */}
      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-neutral-500 font-mono text-center sm:text-left">
        <div 
          onClick={() => {
            if (onLogoClick) onLogoClick();
          }}
          className="cursor-pointer select-none"
        >
          {t.footerRights}
        </div>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:underline">Privacy Policy</a>
          <span>•</span>
          <a href="#terms" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
