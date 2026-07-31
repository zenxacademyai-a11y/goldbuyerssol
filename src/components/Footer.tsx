/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Award, ShieldCheck, Mail, Phone, MapPin, Star, Building2, ChevronRight, Navigation } from "lucide-react";
import { Language, translations } from "../lib/translations.js";

interface FooterProps {
  currentLang: Language;
  setView: (view: "home" | "blog" | "admin" | "about" | "contact" | "branches" | "rates" | "calculator" | "faq" | "services") => void;
  showAdmin?: boolean;
  onLogoClick?: () => void;
}

export default function Footer({ currentLang, setView, showAdmin = false, onLogoClick }: FooterProps) {
  const t = translations[currentLang];

  return (
    <footer className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 border-t border-neutral-200/90 dark:border-neutral-800/90 pt-16 pb-32 sm:pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 relative transition-colors duration-200">
 
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        {/* Brand Column (md:col-span-5) */}
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => {
                if (onLogoClick) onLogoClick();
              }}
              className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-amber-500/40 bg-neutral-950 flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform"
            >
              <img 
                loading="lazy" 
                decoding="async" 
                src="/gbc-logo-original.png" 
                alt="Gold Buyers Colombo Logo" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-serif font-black text-lg sm:text-xl text-neutral-950 dark:text-white tracking-tight">
                {t.fullName}
              </h3>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 uppercase tracking-widest font-mono font-bold">
                {t.tagline}
              </p>
            </div>
          </div>
 
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-sm">
            {t.footerDesc}
          </p>
 
          {/* Licenses & Compliance Badges */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-800 dark:text-neutral-200 border border-amber-500/30 px-3 py-1.5 rounded-xl bg-amber-500/10 shadow-2xs">
              <Building2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>CO. REG: PV 00289799</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 shadow-2xs">
              <Award className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>GJA COMPLIANT</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>SECURED VAULT</span>
            </div>
          </div>
        </div>
 
        {/* Quick Links Column (md:col-span-3) */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
            Quick Navigation
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <li>
              <a 
                href="/" 
                onClick={(e) => { e.preventDefault(); setView("home"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronRight className="h-3 w-3 text-amber-500" />
                <span>{t.home}</span>
              </a>
            </li>
            <li>
              <a 
                href="/services" 
                onClick={(e) => { e.preventDefault(); setView("services"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronRight className="h-3 w-3 text-amber-500" />
                <span>{t.services}</span>
              </a>
            </li>
            <li>
              <a 
                href="/about" 
                onClick={(e) => { e.preventDefault(); setView("about"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronRight className="h-3 w-3 text-amber-500" />
                <span>{t.about}</span>
              </a>
            </li>
            <li>
              <a 
                href="/branches" 
                onClick={(e) => { e.preventDefault(); setView("branches"); window.scrollTo(0,0); }} 
                className="text-amber-700 dark:text-amber-400 font-bold hover:underline transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronRight className="h-3 w-3 text-amber-500" />
                <span>{t.branches}</span>
              </a>
            </li>
            <li>
              <a 
                href="/rates" 
                onClick={(e) => { e.preventDefault(); setView("rates"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronRight className="h-3 w-3 text-amber-500" />
                <span>{t.liveRatesTitle}</span>
              </a>
            </li>
            <li>
              <a 
                href="/calculator" 
                onClick={(e) => { e.preventDefault(); setView("calculator"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronRight className="h-3 w-3 text-amber-500" />
                <span>{t.calcTitle}</span>
              </a>
            </li>
            <li>
              <a 
                href="/blog" 
                onClick={(e) => { e.preventDefault(); setView("blog"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronRight className="h-3 w-3 text-amber-500" />
                <span>{t.blog}</span>
              </a>
            </li>
            <li>
              <a 
                href="/contact" 
                onClick={(e) => { e.preventDefault(); setView("contact"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronRight className="h-3 w-3 text-amber-500" />
                <span>{t.contact}</span>
              </a>
            </li>
            {showAdmin && (
              <li>
                <a 
                  href="/admin" 
                  onClick={(e) => { e.preventDefault(); setView("admin"); window.scrollTo(0,0); }} 
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronRight className="h-3 w-3 text-amber-500" />
                  <span>{t.admin}</span>
                </a>
              </li>
            )}
          </ul>
        </div>
 
        {/* Regional Hub & SEO (md:col-span-4) */}
        <div className="md:col-span-4 space-y-4 text-xs sm:text-sm">
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
            Regional Hub & Contact
          </h4>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Registered head office in Colombo, providing certified appraisal services across Kollupitiya, Bambalapitiya, Wellawatte, Havelock, Dehiwala, Nugegoda, and Mount Lavinia. Fully compliant for <strong>"Gold Buyer in Colombo"</strong>, natural diamonds, gemstones, and luxury watch exchange.
          </p>
          
          <div className="space-y-2 pt-2 text-neutral-800 dark:text-neutral-200 font-medium">
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Galle Road, Colombo 03, Sri Lanka</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <a href="tel:0718321321" className="hover:text-amber-600 font-bold">0718 321 321 / 071 8 321 321</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <a href="mailto:info@goldbuyerscolombo.lk" className="hover:text-amber-600">info@goldbuyerscolombo.lk</a>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="pt-2">
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-xs mb-2">
              <iframe
                title="GBC Google Maps Location"
                src="https://maps.google.com/maps?q=Gold+Buyers+Colombo,+Bernard's+Business+Park,+106+Dutugemunu+St,+Kohuwala&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>
            <a
              href="https://share.google/t37u08yDhse03dO6C"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-lg text-[11px] font-mono font-bold border border-amber-500/30 transition-all flex items-center justify-center gap-2 no-underline"
            >
              <Navigation className="h-3.5 w-3.5 text-amber-600" />
              <span>Open HQ Map Location (Google Maps)</span>
            </a>
          </div>
        </div>
 
      </div>

      {/* Colombo 16 Branches Detailed Directory */}
      <div className="max-w-7xl mx-auto mt-16 pt-10 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h4 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold flex items-center gap-2">
            <Building2 className="h-4.5 w-4.5 text-amber-600" />
            <span>16 Branches in Colombo Directory</span>
          </h4>
          <button 
            onClick={() => { setView("branches"); window.scrollTo(0,0); }}
            className="text-xs text-amber-800 dark:text-amber-300 font-bold hover:bg-amber-500/15 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 transition-all flex items-center gap-1"
          >
            <span>View Interactive Branches Map & Details</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 5 Flagship Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 text-xs text-neutral-600 dark:text-neutral-300 mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div className="space-y-1">
            <h5 className="font-serif font-black text-neutral-900 dark:text-white text-sm">Head Office Branch</h5>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
              No 106, Bernard's Business Park,<br />
              106 Dutugemunu St, Kohuwala
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-serif font-black text-neutral-900 dark:text-white text-sm">Bambalapitiya Branch</h5>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
              W Space, 252A,<br />
              Galle Road, Bambalapitiya, Colombo
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-serif font-black text-neutral-900 dark:text-white text-sm">Dehiwala Branch</h5>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
              Icc Business Center, 68,<br />
              Jayasinghe Mawatha, Nugegoda
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-serif font-black text-neutral-900 dark:text-white text-sm">Kohuwala Branch</h5>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
              68, Kalubowila Hospital Road,<br />
              Kohuwala
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-serif font-black text-neutral-900 dark:text-white text-sm">Dehiwala/Mount Lavinia</h5>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
              13, Katukurunduwatta Road,<br />
              Dehiwala, Mount Lavinia
            </p>
          </div>
        </div>

        {/* Other 11 Branches Grid */}
        <div className="bg-neutral-50 dark:bg-neutral-900/90 rounded-2xl p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <h5 className="text-[11px] font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-bold mb-3">
            Other Secure Appraisal Branches Available:
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2.5 text-[11px] text-neutral-700 dark:text-neutral-300 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>Battaramulla <span className="text-[9px] text-neutral-400 font-mono">(Contact)</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>Nawala <span className="text-[9px] text-neutral-400 font-mono">(Contact)</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>Rajagiriya <span className="text-[9px] text-neutral-400 font-mono">(Contact)</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>Maharagama <span className="text-[9px] text-neutral-400 font-mono">(Contact)</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>Piliyandala <span className="text-[9px] text-neutral-400 font-mono">(Contact)</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>Boralesgamuwa <span className="text-[9px] text-neutral-400 font-mono">(Contact)</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>Nugegoda <span className="text-[9px] text-neutral-400 font-mono">(Contact)</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>Wellawatta <span className="text-[9px] text-neutral-400 font-mono">(Contact)</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span className="truncate">Bauddhaloka Mawatha <span className="text-[9px] text-neutral-400 font-mono">(Contact)</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>Sea Street <span className="text-[9px] text-neutral-400 font-mono">(Contact)</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>Wattala <span className="text-[9px] text-neutral-400 font-mono">(Contact)</span></span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <span className="text-neutral-600 dark:text-neutral-400 font-medium">
              Call our direct desk to speak with any branch manager or schedule a home/office valuation:
            </span>
            <a 
              href="tel:0718321321" 
              className="text-amber-700 dark:text-amber-400 font-mono font-black text-sm bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2 rounded-xl border border-amber-500/20 transition-all shrink-0 no-underline"
            >
              📞 0718 321 321 / 071 8 321 321
            </a>
          </div>
        </div>
      </div>
 
      {/* Footer Bottom Bar with High Contrast & Safe Zone */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 font-mono text-center md:text-left">
        <div className="space-y-1">
          <div 
            onClick={() => {
              if (onLogoClick) onLogoClick();
            }}
            className="cursor-pointer select-none font-medium hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            {t.footerRights}
          </div>
          <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Registered in Sri Lanka under The Companies Act No. 7 of 2007 (Pursuant to Sec. 5) • <span className="text-amber-600 dark:text-amber-400 font-bold">Co. No: PV 00289799</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium shrink-0">
          <a href="#privacy" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#terms" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
