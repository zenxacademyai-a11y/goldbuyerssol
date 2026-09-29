/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  MapPin, 
  Search, 
  ExternalLink, 
  FileCode, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  Calculator, 
  ShieldCheck, 
  Coins, 
  Building2, 
  Phone, 
  FileText, 
  Bot, 
  ArrowRight,
  Database,
  Layers,
  ChevronRight
} from "lucide-react";
import { Language, translations } from "../lib/translations.js";

interface SitemapPageProps {
  currentLang: Language;
  setView: (view: "home" | "admin" | "about" | "contact" | "branches" | "rates" | "calculator" | "services" | "sitemap") => void;
  onSelectService?: (serviceId: string) => void;
  onSelectBranch?: (branchId: string) => void;
}

export default function SitemapPage({
  currentLang,
  setView,
  onSelectService,
  onSelectBranch,
}: SitemapPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const t = translations[currentLang];

  const mainPages = [
    { title: "Home / Live Rates Payout Hub", path: "/", view: "home" as const, desc: "Live 24K, 22K, 21K, and 18K gold rate ticker, overview of services, and interactive valuation." },
    { title: "Computerized Gold Calculator", path: "/calculator", view: "calculator" as const, desc: "Real-time accurate payout calculator for gold grams and sovereigns with zero melting deductions." },
    { title: "Certified Appraisal Services", path: "/services", view: "services" as const, desc: "Gold jewelry, sovereigns & bullion bars, luxury gold watches, and scrap gold buying." },
    { title: "16 Colombo Branch Appraisal Centers", path: "/branches", view: "branches" as const, desc: "Directory of certified physical inspection offices in Nugegoda, Wellawatte, Bambalapitiya, etc." },
    { title: "Daily Live Rates Chart & Analysis", path: "/rates", view: "rates" as const, desc: "Historical price fluctuations, 7-day trends, and Sri Lankan central bank macroeconomic gold indicators." },
    { title: "About Gold Buyers Colombo", path: "/about", view: "about" as const, desc: "Company background, certified assayers, Thermo Fisher XRF non-destructive testing methodology." },
    { title: "Contact & Head Office Private Lounge", path: "/contact", view: "contact" as const, desc: "Nugegoda head office, private lounge directions, customer care hotline, and appointments." },
  ];

  const servicesList = [
    { id: "gold-jewelry", title: "Gold Jewelry Buying", desc: "Top cash payout for 22K (916), 24K, 21K, and 18K bangles, necklaces, rings, and chains." },
    { id: "sovereign-bullion", title: "Gold Sovereigns, Coins & Bullion", desc: "Maximum payout for investment sovereigns, gold biscuits, and 24K hallmark bars." },
    { id: "luxury-watches", title: "Luxury Gold Watches", desc: "Certified valuation for solid gold Rolex, Omega, Cartier, and Patek Philippe timepieces." },
    { id: "scrap-damaged-gold", title: "Broken & Scrap Gold Items", desc: "Instant valuation and payout based strictly on metallurgical content." },
  ];

  const branchesList = [
    { id: "nugegoda-hub", name: "Nugegoda (Corporate Head Office & Lounge)", area: "Greater Colombo" },
    { id: "wellawatte-galle-road", name: "Wellawatte (Colombo 06)", area: "Colombo South" },
    { id: "bambalapitiya-mc", name: "Bambalapitiya (Colombo 04)", area: "Colombo Central" },
    { id: "kollupitiya-liberty", name: "Kollupitiya (Colombo 03)", area: "Colombo Central" },
    { id: "dehiwala-junction", name: "Dehiwala", area: "Greater Colombo" },
    { id: "mount-lavinia-hotel", name: "Mount Lavinia", area: "Greater Colombo" },
    { id: "fort-pettah-gold-quarter", name: "Fort & Pettah (Colombo 01 & 11)", area: "Colombo North" },
    { id: "battaramulla-parliament", name: "Battaramulla & Pelawatte", area: "Colombo Suburbs" },
    { id: "borella-cotta-road", name: "Borella (Colombo 08)", area: "Colombo Central" },
    { id: "cinnamon-gardens", name: "Cinnamon Gardens (Colombo 07)", area: "Colombo Central" },
    { id: "rajagiriya-nawala", name: "Rajagiriya & Nawala", area: "Colombo Suburbs" },
    { id: "moratuwa-rawathawatte", name: "Moratuwa", area: "Southern Corridor" },
    { id: "panadura-town", name: "Panadura", area: "Kalutara District" },
    { id: "wattala-hendala", name: "Wattala & Hendala", area: "Gampaha District" },
    { id: "negombo-beach-road", name: "Negombo", area: "Gampaha District" },
    { id: "kandy-city-hub", name: "Kandy (Central Province)", area: "Central Province" },
  ];

  const sriLankaAreas = [
    { region: "Colombo City (Districts 1-15)", areas: ["Colombo 01 (Fort)", "Colombo 02 (Slave Island)", "Colombo 03 (Kollupitiya)", "Colombo 04 (Bambalapitiya)", "Colombo 05 (Havelock Town / Kirulapone)", "Colombo 06 (Wellawatte)", "Colombo 07 (Cinnamon Gardens)", "Colombo 08 (Borella)", "Colombo 09 (Dematagoda)", "Colombo 10 (Maradana)", "Colombo 11 (Pettah / Sea Street)", "Colombo 12 (Hultsdorf)", "Colombo 13 (Kotahena)", "Colombo 14 (Grandpass)", "Colombo 15 (Mutwal / Modara)"] },
    { region: "Greater Colombo & Southern Suburbs", areas: ["Nugegoda", "Dehiwala", "Mount Lavinia", "Ratmalana", "Moratuwa", "Panadura", "Wadduwa", "Kalutara", "Maharagama", "Kottawa", "Homagama", "Piliyandala", "Kesbewa", "Battaramulla", "Rajagiriya", "Kotte", "Malabe", "Kaduwela", "Athurugiriya"] },
    { region: "Gampaha & Northern Western Province", areas: ["Kelaniya", "Kiribathgoda", "Wattala", "Hendala", "Ja-Ela", "Kandana", "Negombo", "Katunayake (BIA)", "Gampaha City", "Kadawatha", "Minuwangoda", "Yakkala"] },
    { region: "Nationwide & Islandwide Coverage", areas: ["Kandy City", "Galle Fort & Town", "Kurunegala", "Matara", "Ratnapura", "Kegalle", "Gampola", "Avissawella"] }
  ];

  const technicalResources = [
    { title: "XML Sitemap (/sitemap.xml)", href: "/sitemap.xml", desc: "Machine-readable search engine index following sitemaps.org standard." },
    { title: "LLM Knowledge Base (/llms.txt)", href: "/llms.txt", desc: "Plaintext context document for search engines and retrieval systems." },
    { title: "Live Gold Rates JSON API", href: "/api/get-gold-rates.php", desc: "High-frequency REST API outputting current buying rates and market bonuses." },
    { title: "Robots Directives (/robots.txt)", href: "/robots.txt", desc: "Crawler indexing policies for Googlebot, Bingbot, and web crawlers." },
    { title: "Web App Manifest (/manifest.json)", href: "/manifest.json", desc: "PWA installation manifest for iOS and Android smartphones." },
  ];

  const filterMatches = (text: string) => {
    if (!searchTerm.trim()) return true;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen transition-colors duration-200">
      
      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border-b border-neutral-200 dark:border-neutral-800 pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Layers className="h-3.5 w-3.5" />
            <span>Complete Architecture & Coverage Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-neutral-950 dark:text-white tracking-tight">
            HTML Site Map & Index
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Navigate all pages, certified appraisal services, 16 Colombo branch appraisal centers, all served Sri Lankan locations, and AI/LLM developer resources.
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto pt-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search sitemap pages, areas, branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Section 1: Main Platform Views */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg sm:text-xl font-serif font-black text-neutral-900 dark:text-white">
                Main Pages & Views
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400">
              {mainPages.filter(p => filterMatches(p.title + p.desc)).length} Pages
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainPages
              .filter(p => filterMatches(p.title + p.desc + p.path))
              .map((page) => (
                <div
                  key={page.path}
                  onClick={() => {
                    setView(page.view as any);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 group-hover:underline">
                        {page.path}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {page.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {page.desc}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Section 2: Certified Services */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg sm:text-xl font-serif font-black text-neutral-900 dark:text-white">
                Precious Metal Appraisal Services
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400">
              4 Core Lines
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {servicesList
              .filter(s => filterMatches(s.title + s.desc))
              .map((service) => (
                <div
                  key={service.id}
                  onClick={() => {
                    setView("services");
                    if (onSelectService) onSelectService(service.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/50 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold mb-1">
                    /services/{service.id}
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              ))}
          </div>
        </section>

        {/* Section 3: 16 Colombo Branch Centers */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg sm:text-xl font-serif font-black text-neutral-900 dark:text-white">
                Physical Appraisal Centers (16 Branches)
              </h2>
            </div>
            <button
              onClick={() => {
                setView("branches");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View Interactive Map</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {branchesList
              .filter(b => filterMatches(b.name + b.area))
              .map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setView("branches");
                    if (onSelectBranch) onSelectBranch(b.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all cursor-pointer group flex items-start gap-2.5"
                >
                  <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                      {b.name}
                    </h4>
                    <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                      {b.area}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Section 4: All Sri Lanka Coverage Areas Served by Name */}
        <section className="space-y-5">
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg sm:text-xl font-serif font-black text-neutral-900 dark:text-white">
                Sri Lanka Service Locations — All Areas Served by Name
              </h2>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              GBC provides certified on-site appraisals, safe lounge evaluations, and VIP doorstep visits for substantial gold portfolios across the island.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sriLankaAreas.map((group, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-2xs">
                <h3 className="text-xs font-mono uppercase tracking-wider font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                  <span>{group.region}</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.areas
                    .filter(a => filterMatches(a))
                    .map((area, aIdx) => (
                      <span
                        key={aIdx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors"
                      >
                        {area}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Machine-Readable & Technical Endpoints */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg sm:text-xl font-serif font-black text-neutral-900 dark:text-white">
                Machine-Readable & Developer Endpoints
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400">
              For LLMs & Bots
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicalResources.map((res, i) => (
              <a
                key={i}
                href={res.href}
                target={res.href.startsWith("http") || res.href.endsWith(".xml") || res.href.endsWith(".txt") || res.href.endsWith(".php") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/50 hover:shadow-md transition-all group flex flex-col justify-between no-underline"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <FileCode className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <ExternalLink className="h-3.5 w-3.5 text-neutral-400 group-hover:text-amber-500" />
                  </div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-mono">
                    {res.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    {res.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Bottom CTA & Support Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-serif font-bold text-neutral-950 dark:text-white">
              Need Direct Assistance or Branch Navigation?
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Our appraisal hotline is open Monday through Saturday with dedicated senior valuers.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:0718321321"
              className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-mono font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-md no-underline"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>0718 321 321</span>
            </a>
            <button
              onClick={() => {
                setView("contact");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
            >
              Contact Hub
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
