/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense } from "react";
import Header from "./components/Header.js";
import MobileStickyBar from "./components/MobileStickyBar.js";
import Hero from "./components/Hero.js";
import ScrollReveal from "./components/ScrollReveal.js";
import LiveRateWidget from "./components/LiveRateWidget.js";
import Footer from "./components/Footer.js";
import ExitIntentPopup from "./components/ExitIntentPopup.js";
import { Language } from "./lib/translations.js";
import { GoldKarat, GoldRate, SystemSettings, CustomerLead, HistoricalRate } from "./types.js";
import { updateMetaTags } from "./lib/seo.js";
import SEOSchemas from "./components/SEOSchemas.js";
import { DEFAULT_RATES, DEFAULT_SETTINGS, DEFAULT_HISTORICAL, DEFAULT_LEADS } from "./lib/constants.js";
import GoldCalculator from "./components/GoldCalculator.js";
import SellingProcess from "./components/SellingProcess.js";
import Services from "./components/Services.js";
import WhyChooseUs from "./components/WhyChooseUs.js";
import Testimonials from "./components/Testimonials.js";
import ContactSection from "./components/ContactSection.js";
import AdminDashboard from "./components/AdminDashboard.js";
import AboutPage from "./components/AboutPage.js";
import ContactPage from "./components/ContactPage.js";
import ServicesPage from "./components/ServicesPage.js";
import BranchesPage from "./components/BranchesPage.js";
import ChatWithConsultant from "./components/ChatWithConsultant.js";
import FairValuationSection from "./components/FairValuationSection.js";
import HomeAboutSection from "./components/HomeAboutSection.js";
import FinalCTASection from "./components/FinalCTASection.js";
import InstallAppBanner from "./components/InstallAppBanner.js";
import SitemapPage from "./components/SitemapPage.js";

interface AppProps {
  initialView?: "home" | "admin" | "about" | "contact" | "branches" | "rates" | "calculator" | "services" | "sitemap";
  initialServiceId?: string | null;
  initialBranchId?: string | null;
}

export default function App({
  initialView,
  initialServiceId: propServiceId = null,
  initialBranchId: propBranchId = null,
}: AppProps = {}) {
  // Navigation & Language (pure component state - zero local storage)
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    try {
      if (typeof navigator !== "undefined") {
        const browserLangs = navigator.languages || [navigator.language];
        for (const lang of browserLangs) {
          const lowerLang = lang.toLowerCase();
          if (lowerLang.startsWith("si")) return "si";
          if (lowerLang.startsWith("ta")) return "ta";
          if (lowerLang.startsWith("en")) return "en";
        }
      }
    } catch {
      // ignore
    }
    return "en";
  });

  const [activeView, setActiveView] = useState<"home" | "admin" | "about" | "contact" | "branches" | "rates" | "calculator" | "services" | "sitemap">(
    () => {
      if (initialView) return initialView;
      if (typeof window !== "undefined") {
        const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
        if (path === "/about") return "about";
        if (path === "/contact") return "contact";
        if (path === "/branches" || path.startsWith("/branches/")) return "branches";
        if (path === "/services" || path.startsWith("/services/")) return "services";
        if (path === "/rates") return "rates";
        if (path === "/calculator") return "calculator";
        if (path === "/sitemap") return "sitemap";
        if (path === "/admin" || path.startsWith("/admin/")) return "admin";
      }
      return "home";
    }
  );

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(() => {
    if (propServiceId) return propServiceId;
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      if (path.startsWith("/services/") && path.length > 10) {
        return path.substring(10);
      }
    }
    return null;
  });

  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(() => {
    if (propBranchId) return propBranchId;
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      if (path.startsWith("/branches/") && path.length > 10) {
        return path.substring(10);
      }
    }
    return null;
  });

  const [showAdmin, setShowAdmin] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  // Dynamic SEO Page Title & Meta description updates for GEO / CRO / AEO
  useEffect(() => {
    if (activeView === "home") {
      const title = currentLang === "si" 
        ? "රන් බයර්ස් කොළඹ (GBC) | ලංකාවේ රන් සඳහා ඉහළම මිල | Gold Buyers Colombo"
        : currentLang === "ta"
        ? "கோல்ட் பையர்ஸ் கொழும்பு (GBC) | இலங்கையில் தங்கத்திற்கு அதிகபட்ச விலை | Gold Buyers Colombo"
        : "Gold Buyers Colombo (GBC) | Highest Cash Price for Gold in Sri Lanka";

      const desc = currentLang === "si"
        ? "GBC (ගෝල්ඩ් බයර්ස් කොළඹ) වෙතින් ඔබගේ රන් සඳහා ඉහළම මුදලක් ලබා ගන්න. 100% විනිවිද පෙනෙන පරිගණකගත XRF පරීක්ෂාව, සහතික කළ ඩිජිටල් තරාදි සහ ක්ෂණික මුදල්. අදම අපව අමතන්න."
        : currentLang === "ta"
        ? "GBC (கோல்ட் பையர்ஸ் கொழும்பு) மூலம் உங்கள் தங்கத்திற்கு அதிகபட்ச ரொக்கப் பணத்தைப் பெறுங்கள். 100% வெளிப்படையான கணினி XRF சோதனை மற்றும் உடனடி ரொக்கம். இன்றே அணுகவும்."
        : "Sell your gold jewelry, diamonds, gemstones, and luxury watches for the highest cash payout in Colombo, Sri Lanka at GBC. 100% transparent testing and instant cash.";

      const keywords = "gold buyers colombo, sell gold Sri Lanka, highest gold price colombo, best place to sell gold Sri Lanka, sell jewelry Colombo, diamond buyers Sri Lanka, sell luxury watch colombo";

      updateMetaTags(title, desc, keywords);
    } else if (activeView === "rates") {
      const title = currentLang === "si"
        ? "අද රන් මිල කොළඹ - 24K, 22K, 21K, 18K සජීවී මිල ගණන් | GBC"
        : currentLang === "ta"
        ? "இன்றைய தங்க விலை கொழும்பு - 24K, 22K, 21K, 18K நேரலை விலை | GBC"
        : "Today's Gold Rate in Colombo - Live 24K, 22K, 21K, 18K Gold Prices | GBC";

      const desc = currentLang === "si"
        ? "කොළඹ දවසේ සජීවී රන් මිල ගණන්. 24K, 22K, 21K, 18K ග්‍රෑමයක මිල සහ පවුමක මිල ක්ෂණිකව බලාගන්න. GBC ඉහළම වෙළඳපල මිල."
        : currentLang === "ta"
        ? "கொழும்பில் இன்றைய நேரலை தங்க விலை நிலவரம். 24K, 22K, 21K, 18K ஒரு கிராம் மற்றும் பவுன் விலைகளை உடனடியாக அறியுங்கள்."
        : "Check live gold rates in Colombo today. Real-time per gram and pavan rates for 24 Karat, 22 Karat, 21 Karat, and 18 Karat gold in Sri Lankan Rupees.";

      const keywords = "today gold rate colombo, gold price sri lanka, 22k gold price colombo, 24k gold price sri lanka, pavan price colombo, live gold market rate Sri Lanka";

      updateMetaTags(title, desc, keywords);
    } else if (activeView === "calculator") {
      const title = currentLang === "si"
        ? "රන් වටිනාකම් කැල්කියුලේටරය - ඔබගේ රන්වල වටිනාකම ගණනය කරන්න | GBC"
        : currentLang === "ta"
        ? "தங்க மதிப்பு கால்குலேட்டர் - உங்கள் தங்கத்தின் மதிப்பை கணக்கிடுங்கள் | GBC"
        : "Live Gold Value Calculator Sri Lanka - Calculate Cash Payout | GBC";

      const desc = currentLang === "si"
        ? "ඔබ සතුව ඇති රන් ආභරණවල බර සහ කැරට් අගය ඇතුළත් කර ක්ෂණිකව වටිනාකම ගණනය කරගන්න. රහස්‍ය ගාස්තු නැත."
        : currentLang === "ta"
        ? "உங்கள் தங்க நகைகளின் எடை மற்றும் காரட்டை உள்ளிட்டு உடனடி பண மதிப்பைப் பெறுங்கள். மறைமுக கட்டணங்கள் இல்லை."
        : "Calculate your gold's instant cash value in Colombo with our live gold calculator. Instant estimates for 24K, 22K, 21K, and 18K jewelry.";

      const keywords = "gold calculator sri lanka, calculate gold price colombo, gold valuation calculator, sell gold calculator sri lanka";

      updateMetaTags(title, desc, keywords);
    } else if (activeView === "about") {
      const title = currentLang === "si"
        ? "අප ගැන - ගෝල්ඩ් බයර්ස් කොළඹ (GBC) | විශ්වාසනීය රන් ගැනුම්කරු"
        : currentLang === "ta"
        ? "எங்களைப் பற்றி - கோல்ட் பையர்ஸ் கொழும்பு (GBC) | நம்பகமான தங்க கொள்வனவாளர்"
        : "About Us - GBC (Gold Buyers Colombo) | Sri Lanka's Most Trusted Gold Buyers";

      const desc = currentLang === "si"
        ? "GBC හි විනිවිදභාවය, වෘත්තීය XRF රන් සත්‍යාපනය සහ ලෝහ විද්‍යා මණ්ඩලය පිළිබඳව දැනගන්න. වසර ගණනාවක විශ්වාසය සමගින් කොළඹ ප්‍රමුඛතම රන් ගැනුම්කරුවා."
        : currentLang === "ta"
        ? "GBC இன் வெளிப்படைத்தன்மை, தொழில்முறை XRF தங்க சரிபார்ப்பு பற்றி அறியவும். பல வருட நம்பிக்கையுடன் கொழும்பின் முன்னணி தங்க கொள்வனவாளர்."
        : "Learn about GBC's commitment to absolute transparency, professional XRF verification, and buying gold, diamonds, gems, and luxury watches.";

      const keywords = "about gold buyers colombo, trusted gold assayers sri lanka, computer gold testing colombo, diamond buyers Sri Lanka, luxury watch buyers Colombo, gbc history";

      updateMetaTags(title, desc, keywords);
    } else if (activeView === "contact") {
      const title = currentLang === "si"
        ? "සම්බන්ධ වන්න - ගෝල්ඩ් බයර්ස් කොළඹ (GBC) | අපගේ ශාඛාව සහ දුරකථන අංක"
        : currentLang === "ta"
        ? "தொடர்புகொள்ள - கோல்ட் பையர்ஸ் கொழும்பு (GBC) | கிளை முகவரி மற்றும் தொலைபேசி"
        : "Contact GBC (Gold Buyers Colombo) | Branch Locations & Phone Numbers";

      const desc = currentLang === "si"
        ? "ඔබගේ රන් ක්ෂණිකව තක්සේරු කර ගැනීමට අදම GBC අමතන්න. කොළඹ ප්‍රමුඛතම රන් ගැනුම්කරුවන් වන අපගේ ආරක්ෂිත ශාඛාවට පැමිණෙන්න."
        : currentLang === "ta"
        ? "உங்கள் தங்கத்தை உடனடியாக மதிப்பிட இன்றே GBC ஐ தொடர்பு கொள்ளவும். கொழும்பின் முன்னணி தங்க கொள்வனவாளரான எங்களை அணுகவும்."
        : "Contact GBC for instant valuations of gold, diamonds, gemstones, and luxury watches. Get directions to our secure Colombo branches today.";

      const keywords = "contact gold buyers colombo, colombo gold buyer phone number, sell diamonds Sri Lanka, watch buyers Colombo, gbc branch address, find gold buyers colombo";

      updateMetaTags(title, desc, keywords);
    } else if (activeView === "branches") {
      const title = currentLang === "si"
        ? "කොළඹ ශාඛා 16ක් - ගෝල්ඩ් බයර්ස් කොළඹ (GBC) | ඔබ ළඟම ඇති ශාඛාව"
        : currentLang === "ta"
        ? "கொழும்பில் 16 கிளைகள் - கோல்ட் பையர்ஸ் கொழும்பு (GBC) | அருகில் உள்ள கிளை"
        : "16 Branches in Colombo - GBC (Gold Buyers Colombo) | Find Your Nearest Branch";

      const desc = currentLang === "si"
        ? "කොළඹ වටා පිහිටි අපගේ GBC ශාඛා 16 බලන්න. දෙහිවල, බම්බලපිටිය, කොහුවල ඇතුළු ප්‍රධාන නගර වල අපගේ ශාඛා පිහිටා ඇත. ඔබ ළඟම ඇති රන් ගැනුම්කරු."
        : currentLang === "ta"
        ? "கொழும்பில் உள்ள எங்களது 16 GBC கிளைகளைக் கண்டறியவும். தெஹிவளை, பம்பலபிட்டி, கோஹுவளை உள்ளிட்ட இடங்களில் எங்கள் கிளைகள் உள்ளன."
        : "Find one of our 16 buying branches in Colombo for gold, diamonds, gems, and watches. Secure, private locations in Dehiwala, Bambalapitiya, Kohuwala, Nugegoda, and more.";

      const keywords = "gold buyer branches colombo, diamond jewelry buyers Sri Lanka, sell luxury watches Colombo, dehiwala gold buyer, kohuwala gold shop, bambalapitiya gold buyer";

      updateMetaTags(title, desc, keywords);
    } else if (activeView === "sitemap") {
      updateMetaTags(
        "HTML Sitemap & Architecture | GBC (Gold Buyers Colombo)",
        "Complete directory of gold appraisal services, 16 Colombo branch locations, all Sri Lanka coverage areas, and services.",
        "gold buyers colombo sitemap, gbc sitemap, sri lanka gold branches directory"
      );
    } else if (activeView === "admin") {
      updateMetaTags(
        "Secure Admin Dashboard | GBC (Gold Buyers Colombo)",
        "Administrative controls for GBC (Gold Buyers Colombo) system metrics, daily rates calibration, and customer inquiry processing.",
        "gbc admin, gold buyers colombo admin dashboard"
      );
    }
  }, [activeView, currentLang]);

  // Synchronize state to URL path
  useEffect(() => {
    const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, "");
    let targetPath = activeView === "home" ? "" : `/${activeView}`;
    
    if (activeView === "services" && selectedServiceId) {
      targetPath = `/services/${selectedServiceId}`;
    } else if (activeView === "branches" && selectedBranchId) {
      targetPath = `/branches/${selectedBranchId}`;
    } else if (activeView === "admin" && (currentPath === "/admin/leads" || currentPath === "/admin/rates" || currentPath === "/admin/database")) {
      targetPath = currentPath;
    }
    
    if (currentPath !== targetPath) {
      window.history.pushState({ view: activeView, service: selectedServiceId, branch: selectedBranchId }, "", targetPath || "/");
    }
  }, [activeView, selectedServiceId, selectedBranchId]);

  // Pathname routing on load & popstate + Admin check
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      if (path === "/about") {
        setActiveView("about");
      } else if (path === "/contact") {
        setActiveView("contact");
      } else if (path === "/branches" || path.startsWith("/branches/")) {
        setActiveView("branches");
        if (path.startsWith("/branches/") && path.length > 10) {
          setSelectedBranchId(path.substring(10));
        } else {
          setSelectedBranchId(null);
        }
      } else if (path === "/services" || path.startsWith("/services/")) {
        setActiveView("services");
        if (path.startsWith("/services/") && path.length > 10) {
          setSelectedServiceId(path.substring(10));
        } else {
          setSelectedServiceId(null);
        }
      } else if (path === "/rates") {
        setActiveView("rates");
      } else if (path === "/calculator") {
        setActiveView("calculator");
      } else if (path === "/sitemap") {
        setActiveView("sitemap");
      } else if (path === "/admin" || path.startsWith("/admin/")) {
        setActiveView("admin");
      } else {
        setActiveView("home");
      }
    };

    handleUrlRouting();
    window.addEventListener("popstate", handleUrlRouting);

    const isUrlAdmin = typeof window !== "undefined" && (window.location.search.includes("admin=true") || window.location.hash === "#admin");
    if (isUrlAdmin) {
      setShowAdmin(true);
    }

    return () => window.removeEventListener("popstate", handleUrlRouting);
  }, []);

  const handleLogoClick = () => {
    const nextCount = logoClicks + 1;
    setLogoClicks(nextCount);
    if (nextCount >= 5) {
      setShowAdmin(true);
      setActiveView("admin");
      setLogoClicks(0);
    }
  };

  // Dynamic state loaded from PHP/MySQL Backend
  const [rates, setRates] = useState<GoldRate[]>(DEFAULT_RATES);
  const [settings, setSettings] = useState<SystemSettings | null>(DEFAULT_SETTINGS);
  const [leads, setLeads] = useState<CustomerLead[]>(DEFAULT_LEADS);
  const [historicalRates, setHistoricalRates] = useState<HistoricalRate[]>(DEFAULT_HISTORICAL);
  const [isLoading, setIsLoading] = useState(true);

  // Authoritative data loader with PHP REST API and MySQL database
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "/api";

      const jsonCheck = async (r: Response) => {
        if (r.ok) {
          const contentType = r.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            return r.json();
          }
        }
        return null;
      };

      const ts = Date.now();
      const fetchOpts = {
        cache: "no-store" as RequestCache,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
        },
      };

      // Primary Authoritative Production API Endpoint: https://goldbuyerscolombo.com/api/get-gold-rates.php
      let fetchedFromBackend = false;
      try {
        // First try the primary get-gold-rates.php endpoint
        const primaryRes = await fetch(`${apiBase}/get-gold-rates.php?_t=${ts}`, fetchOpts)
          .then(jsonCheck)
          .catch(() => null);

        if (primaryRes) {
          const ratesList = primaryRes.data?.rates || primaryRes.rates;
          if (Array.isArray(ratesList) && ratesList.length > 0) {
            setRates(ratesList);
            fetchedFromBackend = true;
          }

          const settingsObj = primaryRes.data?.settings || primaryRes.settings;
          if (settingsObj && typeof settingsObj === "object") {
            setSettings(settingsObj);
          }

          const histList = primaryRes.data?.historical || primaryRes.historical;
          if (Array.isArray(histList) && histList.length > 0) {
            setHistoricalRates(histList);
          }
        }

        // Secondary endpoints for leads, settings, history if not loaded from primary
        const [ratesRes, settingsRes, leadsRes, histRes] = await Promise.all([
          !fetchedFromBackend ? fetch(`${apiBase}/rates?_t=${ts}`, fetchOpts).then(jsonCheck).catch(() => null) : null,
          fetch(`${apiBase}/settings?_t=${ts}`, fetchOpts).then(jsonCheck).catch(() => null),
          fetch(`${apiBase}/leads?_t=${ts}`, fetchOpts).then(jsonCheck).catch(() => null),
          fetch(`${apiBase}/rates/history?_t=${ts}`, fetchOpts).then(jsonCheck).catch(() => null),
        ]);

        // 1. Process Gold Rates from PHP MySQL API if not already fetched
        if (!fetchedFromBackend && ratesRes) {
          let parsedRates: GoldRate[] | null = null;
          if (ratesRes.success && ratesRes.data?.rates && Array.isArray(ratesRes.data.rates)) {
            parsedRates = ratesRes.data.rates;
          } else if (Array.isArray(ratesRes)) {
            parsedRates = ratesRes;
          } else if (ratesRes.rates && Array.isArray(ratesRes.rates)) {
            parsedRates = ratesRes.rates;
          }
          if (parsedRates && parsedRates.length > 0) {
            setRates(parsedRates);
            fetchedFromBackend = true;
          }
        }

        // 2. Process System Settings
        let parsedSettings: SystemSettings | null = null;
        if (ratesRes?.data?.settings) {
          parsedSettings = ratesRes.data.settings;
        } else if (settingsRes) {
          if (settingsRes.success && settingsRes.data) {
            parsedSettings = settingsRes.data;
          } else if (typeof settingsRes === "object") {
            parsedSettings = settingsRes;
          }
        }
        if (parsedSettings) {
          setSettings(parsedSettings);
        }

        // 3. Process Leads from MySQL database
        if (leadsRes) {
          const rawLeadsList = leadsRes.success && Array.isArray(leadsRes.data) ? leadsRes.data : (Array.isArray(leadsRes) ? leadsRes : null);
          if (rawLeadsList) {
            const mappedLeads: CustomerLead[] = rawLeadsList.map((l: any) => ({
              id: String(l.id || l.lead_uuid),
              name: l.name || `${l.first_name || ''} ${l.last_name || ''}`.trim() || 'Valuation Lead',
              phone: l.phone || '',
              email: l.email || undefined,
              goldKarat: (l.karat_interest as GoldKarat) || (l.goldKarat as GoldKarat) || GoldKarat.K22,
              weightGrams: Number(l.gold_weight || l.weightGrams || 0),
              estimatedValue: Number(l.estimatedValue || 0),
              status: l.status === 'new' ? 'New' : l.status === 'contacted' ? 'Contacted' : l.status === 'won' ? 'Completed' : 'New',
              message: l.notes || l.message || undefined,
              createdAt: l.created_at || new Date().toISOString()
            }));
            setLeads(mappedLeads);
          }
        }

        // 4. Process Historical Rates
        if (histRes) {
          const rawHist = histRes.success && Array.isArray(histRes.data) ? histRes.data : (Array.isArray(histRes) ? histRes : null);
          if (rawHist && rawHist.length > 0) {
            setHistoricalRates(rawHist);
          }
        }
      } catch (networkErr) {
        console.warn("PHP MySQL Backend API not reachable:", networkErr);
      }

      if (!fetchedFromBackend) {
        setRates(DEFAULT_RATES);
        setSettings(DEFAULT_SETTINGS);
        setLeads(DEFAULT_LEADS);
        setHistoricalRates(DEFAULT_HISTORICAL);
      }
    } catch (e) {
      console.warn("Client data initialization info:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Authoritative page load: Fetch rates from MySQL once on page mount (manual refresh updates the UI)
  useEffect(() => {
    fetchAllData();
  }, []);

  // Handlers with PHP MySQL backend synchronization (Zero LocalStorage)
  const handleUpdateRates = async (updatedRates: GoldRate[]) => {
    // 1. Immediately update React state so the UI reflects changes instantly
    setRates(updatedRates);

    const nowIso = new Date().toISOString();
    const newSettings = { ...activeSettings, lastUpdated: nowIso };
    setSettings(newSettings);

    // 2. Update historical chart latest point to reflect the new 22K rate
    const rate22 = updatedRates.find((r) => (r.karat as string) === "22K" || r.karat === GoldKarat.K22)?.ratePerGram;
    const rate24 = updatedRates.find((r) => (r.karat as string) === "24K" || r.karat === GoldKarat.K24)?.ratePerGram;
    if (rate22 && historicalRates.length > 0) {
      const updatedHist = [...historicalRates];
      const lastIdx = updatedHist.length - 1;
      updatedHist[lastIdx] = {
        ...updatedHist[lastIdx],
        "22K": Math.round(rate22 * activeSettings.pavanWeightGrams),
        "24K": rate24 ? Math.round(rate24 * activeSettings.pavanWeightGrams) : updatedHist[lastIdx]["24K"]
      };
      setHistoricalRates(updatedHist);
    }

    // 3. Save directly to MySQL via PHP API (/api/get-gold-rates.php)
    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "/api";
    try {
      const response = await fetch(`${apiBase}/get-gold-rates.php`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify({ 
          rates: updatedRates,
          settings: newSettings
        }),
      });
      if (response.ok) {
        const resJson = await response.json();
        if (resJson?.data?.rates && Array.isArray(resJson.data.rates)) {
          setRates(resJson.data.rates);
        }
      } else {
        // Fallback to /api/rates
        await fetch(`${apiBase}/rates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rates: updatedRates, settings: newSettings })
        });
      }
    } catch (e) {
      console.warn("Backend PHP API rate update deferred:", e);
    }
  };

  const handleUpdateSettings = async (updatedSettings: SystemSettings) => {
    setSettings(updatedSettings);

    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "/api";
    try {
      await fetch(`${apiBase}/get-gold-rates.php`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify({ settings: updatedSettings }),
      });
    } catch (e) {
      console.warn("Backend settings sync error:", e);
    }
  };

  const handleDeleteLead = async (id: string) => {
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);

    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "/api";
    try {
      await fetch(`${apiBase}/leads?id=${id}`, { method: "DELETE" });
    } catch (e) {
      console.warn("Backend lead delete deferred:", e);
    }
  };

  const defaultSettingsFallback: SystemSettings = {
    bonusPremiumRate: 2.5,
    testingFeePerGram: 0,
    pavanWeightGrams: 8,
    lastUpdated: new Date().toISOString()
  };

  const activeSettings = settings || defaultSettingsFallback;

  const rate24k = rates.find((r) => r.karat === GoldKarat.K24 || (r.karat as string) === "24K")?.ratePerGram || 25600;
  const rate22k = rates.find((r) => r.karat === GoldKarat.K22 || (r.karat as string) === "22K")?.ratePerGram || 23450;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950 transition-colors">
      {/* Search Engine Optimization JSON-LD Schemas */}
      <SEOSchemas rates={rates} />

      {/* Main Global Navigation */}
      <Header
        currentLang={currentLang}
        setLang={setCurrentLang}
        activeView={activeView}
        setView={(view) => {
          setActiveView(view);
          if (view === "services") setSelectedServiceId(null);
          if (view === "branches") setSelectedBranchId(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        todayRate24k={rate24k}
        todayRate22k={rate22k}
        showAdmin={showAdmin}
        onLogoClick={handleLogoClick}
      />

      {/* PWA Install Banner */}
      <InstallAppBanner currentLang={currentLang} />

      {/* Main Dynamic View Layout */}
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-amber-500 font-mono text-sm">Loading Gold Buyers Colombo...</div>}>
        {activeView === "home" ? (
          <>
            {/* 1. Hero Section with Live Rate Highlight */}
            <Hero
              currentLang={currentLang}
              todayRate24k={rate24k}
              todayRate22k={rate22k}
            />

            {/* 2. Transparent 4-Step Process */}
            <ScrollReveal>
              <SellingProcess currentLang={currentLang} />
            </ScrollReveal>

            {/* 3. Core Value Proposition */}
            <ScrollReveal>
              <WhyChooseUs currentLang={currentLang} />
            </ScrollReveal>

            {/* 4. Live Rates Matrix & Instant Calculator */}
            <div className="space-y-12">
              <ScrollReveal>
                <LiveRateWidget
                  currentLang={currentLang}
                  rates={rates}
                  settings={activeSettings}
                  historicalRates={historicalRates}
                  onRefresh={fetchAllData}
                  isLoading={isLoading}
                />
              </ScrollReveal>

              <ScrollReveal>
                <GoldCalculator
                  currentLang={currentLang}
                  rates={rates}
                  settings={activeSettings}
                  isLoading={isLoading}
                />
              </ScrollReveal>
            </div>

            {/* 5. What We Buy */}
            <ScrollReveal>
              <Services currentLang={currentLang} />
            </ScrollReveal>

            {/* 6. Why Our Valuation Is Fair */}
            <ScrollReveal>
              <FairValuationSection currentLang={currentLang} />
            </ScrollReveal>

            {/* 7. Customer Testimonials */}
            <ScrollReveal>
              <Testimonials currentLang={currentLang} />
            </ScrollReveal>

            {/* 8. About Section / Company Story */}
            <ScrollReveal>
              <HomeAboutSection currentLang={currentLang} setView={setActiveView} />
            </ScrollReveal>
            
            {/* 9. Final High-Converting CTA & Contact Location */}
            <ScrollReveal>
              <FinalCTASection currentLang={currentLang} />
            </ScrollReveal>

            <ScrollReveal>
              <ContactSection currentLang={currentLang} />
            </ScrollReveal>
          </>
        ) : activeView === "services" ? (
          <ServicesPage 
            currentLang={currentLang}
            selectedServiceId={selectedServiceId}
            onSelectService={(id) => {
              setSelectedServiceId(id);
              setActiveView("services");
            }}
            setView={setActiveView}
            onSelectBranch={(id) => {
              setSelectedBranchId(id);
              setActiveView("branches");
            }}
          />
        ) : activeView === "sitemap" ? (
          <SitemapPage 
            currentLang={currentLang} 
            setView={setActiveView}
            onSelectService={(id) => {
              setSelectedServiceId(id);
              setActiveView("services");
            }}
            onSelectBranch={(id) => {
              setSelectedBranchId(id);
              setActiveView("branches");
            }}
          />
        ) : activeView === "about" ? (
          <AboutPage currentLang={currentLang} setView={setActiveView} />
        ) : activeView === "contact" ? (
          <ContactPage currentLang={currentLang} />
        ) : activeView === "branches" ? (
          <BranchesPage 
            currentLang={currentLang}
            selectedBranchId={selectedBranchId}
            onSelectBranch={(id) => {
              setSelectedBranchId(id);
              setActiveView("branches");
            }}
            setView={setActiveView}
          />
        ) : activeView === "rates" ? (
          <div className="pt-8 pb-12 min-h-[60vh] bg-white dark:bg-neutral-950 transition-colors">
            <LiveRateWidget
              currentLang={currentLang}
              rates={rates}
              settings={activeSettings}
              historicalRates={historicalRates}
              onRefresh={fetchAllData}
              isLoading={isLoading}
            />
          </div>
        ) : activeView === "calculator" ? (
          <div className="pt-8 pb-12 min-h-[60vh] bg-neutral-50 dark:bg-neutral-950 transition-colors">
            <GoldCalculator
              currentLang={currentLang}
              rates={rates}
              settings={activeSettings}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <AdminDashboard
            currentLang={currentLang}
            rates={rates}
            settings={activeSettings}
            leads={leads}
            onUpdateRates={handleUpdateRates}
            onUpdateSettings={handleUpdateSettings}
            onDeleteLead={handleDeleteLead}
            onViewSite={() => {
              setActiveView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
        </Suspense>
      </main>

      {/* Sticky Bottom Bar for Mobile Users */}
      <MobileStickyBar
        currentLang={currentLang}
        todayRate24k={rate24k}
        todayRate22k={rate22k}
      />

      {/* Global AI WhatsApp Assistant widget */}
      <ChatWithConsultant currentLang={currentLang} />

      {/* Smart Exit-Intent Lead Recovery Popup */}
      <ExitIntentPopup currentLang={currentLang} />

      {/* Footer with legal info, certifications, quick navigation & contact info */}
      <Footer
        currentLang={currentLang}
        setView={(view) => {
          setActiveView(view);
          if (view === "services") setSelectedServiceId(null);
          if (view === "branches") setSelectedBranchId(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        showAdmin={showAdmin}
        onLogoClick={handleLogoClick}
      />
    </div>
  );
}
