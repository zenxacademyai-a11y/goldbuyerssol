/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Award, ShieldCheck, Mail, Phone, MapPin, Building2, ChevronRight, Navigation, ArrowUp, Clock, HelpCircle, FileText, Calculator, TrendingUp, Sparkles, Info } from "lucide-react";
import { Language, translations } from "../lib/translations.js";
import InstallWebAppButton from "./InstallWebAppButton.js";

interface FooterProps {
  currentLang: Language;
  setView: (view: "home" | "blog" | "admin" | "about" | "contact" | "branches" | "rates" | "calculator" | "faq" | "services") => void;
  showAdmin?: boolean;
  onLogoClick?: () => void;
}

export default function Footer({ currentLang, setView, showAdmin = false, onLogoClick }: FooterProps) {
  const t = translations[currentLang];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 border-t border-neutral-200/90 dark:border-neutral-800/90 pt-12 sm:pt-16 pb-28 sm:pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 relative transition-colors duration-200">
 
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Brand Column (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => {
                if (onLogoClick) onLogoClick();
              }}
              className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-amber-500/40 bg-neutral-950 flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0"
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
          <div className="flex flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-800 dark:text-neutral-200 border border-amber-500/30 px-2.5 py-1.5 rounded-xl bg-amber-500/10 shadow-2xs">
              <Building2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>CO. REG: PV 00289799</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 px-2.5 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 shadow-2xs">
              <Award className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>GJA COMPLIANT</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 px-2.5 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>SECURED VAULT</span>
            </div>
          </div>
        </div>
 
        {/* Quick Links Column (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold border-b border-neutral-100 dark:border-neutral-900 pb-2">
            Quick Navigation
          </h4>
          <ul className="grid grid-cols-2 lg:grid-cols-1 gap-2 text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <li>
              <a 
                href="/" 
                onClick={(e) => { e.preventDefault(); setView("home"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 py-1"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{t.home}</span>
              </a>
            </li>
            <li>
              <a 
                href="/services" 
                onClick={(e) => { e.preventDefault(); setView("services"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 py-1"
              >
                <ChevronRight className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{t.services}</span>
              </a>
            </li>
            <li>
              <a 
                href="/rates" 
                onClick={(e) => { e.preventDefault(); setView("rates"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 py-1"
              >
                <TrendingUp className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{t.liveRatesTitle}</span>
              </a>
            </li>
            <li>
              <a 
                href="/calculator" 
                onClick={(e) => { e.preventDefault(); setView("calculator"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 py-1"
              >
                <Calculator className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{t.calcTitle}</span>
              </a>
            </li>
            <li>
              <a 
                href="/branches" 
                onClick={(e) => { e.preventDefault(); setView("branches"); window.scrollTo(0,0); }} 
                className="text-amber-700 dark:text-amber-400 font-bold hover:underline transition-colors cursor-pointer flex items-center gap-1.5 py-1"
              >
                <Building2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{t.branches}</span>
              </a>
            </li>
            <li>
              <a 
                href="/about" 
                onClick={(e) => { e.preventDefault(); setView("about"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 py-1"
              >
                <Info className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{t.about}</span>
              </a>
            </li>
            <li>
              <a 
                href="/blog" 
                onClick={(e) => { e.preventDefault(); setView("blog"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 py-1"
              >
                <FileText className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{t.blog}</span>
              </a>
            </li>
            <li>
              <a 
                href="/contact" 
                onClick={(e) => { e.preventDefault(); setView("contact"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 py-1"
              >
                <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{t.contact}</span>
              </a>
            </li>
            <li>
              <a 
                href="/faq" 
                onClick={(e) => { e.preventDefault(); setView("faq"); window.scrollTo(0,0); }} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 py-1"
              >
                <HelpCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{t.faq}</span>
              </a>
            </li>
            <li className="col-span-2 lg:col-span-1 pt-1">
              <InstallWebAppButton currentLang={currentLang} variant="footer-button" />
            </li>
            {showAdmin && (
              <li>
                <a 
                  href="/admin" 
                  onClick={(e) => { e.preventDefault(); setView("admin"); window.scrollTo(0,0); }} 
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 py-1"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>{t.admin}</span>
                </a>
              </li>
            )}
          </ul>
        </div>
 
        {/* Regional Hub & Contact (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-3 text-xs sm:text-sm">
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold border-b border-neutral-100 dark:border-neutral-900 pb-2">
            Regional Hub & Contact
          </h4>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-xs">
            Head Office in Nugegoda with certified appraisal centers across Kollupitiya, Bambalapitiya, Wellawatte, Havelock, Dehiwala, Nugegoda, and Mount Lavinia.
          </p>
          
          <div className="space-y-2 pt-1 text-neutral-800 dark:text-neutral-200 font-medium text-xs">
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>68 S. De S. Jayasinghe Mawatha, Nugegoda 10250</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <a href="tel:0718321321" className="hover:text-amber-600 font-bold font-mono">0718 321 321 / 071 8 321 321</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <a href="mailto:Goldbuyerscolombolk@gmail.com" className="hover:text-amber-600">Goldbuyerscolombolk@gmail.com</a>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="pt-2">
            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-xs mb-2">
              <iframe
                title="GBC Google Maps Location"
                src="https://maps.google.com/maps?q=Gold+Buyers+Colombo,+68+S.+De+S.+Jayasinghe+Mawatha,+Nugegoda+10250,+Sri+Lanka&t=&z=14&ie=UTF8&iwloc=&output=embed"
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
              <Navigation className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>Open Head Office Map Location</span>
            </a>
          </div>
        </div>
 
      </div>

      {/* Colombo 16 Branches Detailed Directory */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h4 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold flex items-center gap-2">
            <Building2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
            <span>16 Branches in Colombo Directory</span>
          </h4>
          <button 
            onClick={() => { setView("branches"); window.scrollTo(0,0); }}
            className="text-xs text-amber-800 dark:text-amber-300 font-bold hover:bg-amber-500/15 bg-amber-500/10 px-3.5 py-1.5 rounded-xl border border-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>View Interactive Branches Map</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 5 Flagship Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs text-neutral-600 dark:text-neutral-300 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 space-y-1">
            <h5 className="font-serif font-black text-neutral-900 dark:text-white text-xs text-amber-600 dark:text-amber-400">Head Office</h5>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
              No 106, Bernard's Business Park,<br />
              106 Dutugemunu St, Kohuwala
            </p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 space-y-1">
            <h5 className="font-serif font-black text-neutral-900 dark:text-white text-xs">Bambalapitiya</h5>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
              W Space, 252A,<br />
              Galle Road, Bambalapitiya
            </p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 space-y-1">
            <h5 className="font-serif font-black text-neutral-900 dark:text-white text-xs">Nugegoda</h5>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
              68 S. De S. Jayasinghe Mawatha,<br />
              Nugegoda 10250, Sri Lanka
            </p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 space-y-1">
            <h5 className="font-serif font-black text-neutral-900 dark:text-white text-xs">Kohuwala</h5>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
              68, Kalubowila Hospital Road,<br />
              Kohuwala
            </p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 space-y-1">
            <h5 className="font-serif font-black text-neutral-900 dark:text-white text-xs">Dehiwala / Mt Lavinia</h5>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
              13, Katukurunduwatta Road,<br />
              Dehiwala, Mount Lavinia
            </p>
          </div>
        </div>

        {/* Other 11 Branches Grid */}
        <div className="bg-neutral-50 dark:bg-neutral-900/90 rounded-2xl p-4 sm:p-5 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <h5 className="text-[11px] font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-bold mb-3">
            Other Secure Appraisal Branch Hubs:
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-2 text-[11px] text-neutral-700 dark:text-neutral-300 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Battaramulla</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Nawala</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Rajagiriya</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Maharagama</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Piliyandala</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Boralesgamuwa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Nugegoda Hub</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Wellawatta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span className="truncate">Bauddhaloka Mawatha</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Sea Street</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Wattala</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <span className="text-neutral-600 dark:text-neutral-400 font-medium">
              Call our direct desk to speak with any branch manager or schedule a home/office valuation:
            </span>
            <a 
              href="tel:0718321321" 
              className="text-amber-700 dark:text-amber-400 font-mono font-black text-xs bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-1.5 rounded-xl border border-amber-500/20 transition-all shrink-0 no-underline flex items-center gap-1.5"
            >
              <Phone className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>0718 321 321</span>
            </a>
          </div>
        </div>
      </div>
 
      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 font-mono text-center md:text-left">
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
            Registered in Sri Lanka under The Companies Act No. 7 of 2007 • <span className="text-amber-600 dark:text-amber-400 font-bold">Co. No: PV 00289799</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium shrink-0">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-mono font-bold hover:underline bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 cursor-pointer"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

