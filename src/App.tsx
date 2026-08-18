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
import { GoldKarat, GoldRate, SystemSettings, CustomerLead, BlogPost, HistoricalRate } from "./types.js";
import { updateMetaTags } from "./lib/seo.js";
import SEOSchemas from "./components/SEOSchemas.js";
import { localDb, fetchFallbackData } from "./lib/localDb.js";
import GoldCalculator from "./components/GoldCalculator.js";
import SellingProcess from "./components/SellingProcess.js";
import Services from "./components/Services.js";
import WhyChooseUs from "./components/WhyChooseUs.js";
import Testimonials from "./components/Testimonials.js";
import FAQSection from "./components/FAQSection.js";
import ContactSection from "./components/ContactSection.js";
import BlogPreview from "./components/BlogPreview.js";
import AdminDashboard from "./components/AdminDashboard.js";
import AboutPage from "./components/AboutPage.js";
import ContactPage from "./components/ContactPage.js";
import ServicesPage from "./components/ServicesPage.js";
import BranchesPage from "./components/BranchesPage.js";
import RecentPosts from "./components/RecentPosts.js";
import ChatWithConsultant from "./components/ChatWithConsultant.js";
import FairValuationSection from "./components/FairValuationSection.js";
import HomeAboutSection from "./components/HomeAboutSection.js";
import FinalCTASection from "./components/FinalCTASection.js";
import InstallAppBanner from "./components/InstallAppBanner.js";

interface AppProps {
  initialView?: "home" | "blog" | "admin" | "about" | "contact" | "branches" | "rates" | "calculator" | "faq" | "services";
  initialBlogSlug?: string | null;
  initialServiceId?: string | null;
  initialBranchId?: string | null;
  initialBlogsData?: BlogPost[];
}

export default function App({
  initialView,
  initialBlogSlug: propBlogSlug = null,
  initialServiceId: propServiceId = null,
  initialBranchId: propBranchId = null,
  initialBlogsData,
}: AppProps = {}) {
  // Increment visit count for PWA install prompt & analytics on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        const currentVisits = parseInt(localStorage.getItem("gbc_visit_count") || "0", 10);
        localStorage.setItem("gbc_visit_count", (currentVisits + 1).toString());
      }
    } catch {
      // ignore restricted mode / localStorage errors
    }
  }, []);

  // Navigation & Language
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return "en";
    }
    // 1. Check if user has a persisted language choice
    const saved = localStorage.getItem("gbc_user_lang");
    if (saved === "en" || saved === "si" || saved === "ta") {
      return saved as Language;
    }

    // 2. First visit - detect browser language (English, Sinhala, or Tamil)
    try {
      const browserLangs = navigator.languages || [navigator.language];
      for (const lang of browserLangs) {
        const lowerLang = lang.toLowerCase();
        if (lowerLang.startsWith("si")) {
          localStorage.setItem("gbc_user_lang", "si");
          return "si";
        }
        if (lowerLang.startsWith("ta")) {
          localStorage.setItem("gbc_user_lang", "ta");
          return "ta";
        }
        if (lowerLang.startsWith("en")) {
          localStorage.setItem("gbc_user_lang", "en");
          return "en";
        }
      }
    } catch (e) {
      console.warn("Failed to automatically detect browser language:", e);
    }

    // Default to "en"
    return "en";
  });

  // Sync manual language selection changes to localStorage for subsequent sessions
  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem("gbc_user_lang", currentLang);
    }
  }, [currentLang]);

  const [activeView, setActiveView] = useState<"home" | "blog" | "admin" | "about" | "contact" | "branches" | "rates" | "calculator" | "faq" | "services">(
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
        if (path === "/faq") return "faq";
        if (path === "/blog" || path.startsWith("/blog/")) return "blog";
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

  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(() => {
    if (propBlogSlug) return propBlogSlug;
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      if (path.startsWith("/blog/") && path.length > 6) {
        return path.substring(6);
      }
    }
    return null;
  });
  const [showAdmin, setShowAdmin] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  // Dynamic SEO Page Title & Meta description updates for GEO / CRO / AEO
  useEffect(() => {
    // Skip blog view metadata updates here because BlogPreview component manages its own internal 
    // active article detail view versus catalog listing metadata dynamically.
    if (activeView === "blog") return;

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

      const keywords = "gold buyer in colombo, gold price today colombo, sell gold sri lanka, highest gold price colombo, diamond buyers Sri Lanka, sell gemstones Sri Lanka, luxury watch buyers Colombo, cash for diamonds, Rolex buyers Sri Lanka, gbc gold buyers";
      
      updateMetaTags(title, desc, keywords);
    } else if (activeView === "services") {
      document.title = "Our Services | Gold Buyers Colombo";
      updateMetaTags("Our Services | Gold Buyers Colombo", "Explore our gold, diamond, and watch buying services.", "gold buying service, diamond buyer, colombo, sri lanka");
    } else if (activeView === "about") {
      const title = currentLang === "si"
        ? "අප ගැන - ගෝල්ඩ් බයර්ස් කොළඹ (GBC) | විශ්වාසදායක රන් ගැනුම්කරුවන්"
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
    } else if (activeView === "blog" && selectedBlogSlug) {
      targetPath = `/blog/${selectedBlogSlug}`;
    } else if (activeView === "admin" && (currentPath === "/admin/leads" || currentPath === "/admin/rates" || currentPath === "/admin/blog")) {
      targetPath = currentPath;
    }
    
    if (currentPath !== targetPath) {
      window.history.pushState({ view: activeView, service: selectedServiceId, branch: selectedBranchId }, "", targetPath || "/");
    }
  }, [activeView, selectedServiceId, selectedBranchId, selectedBlogSlug]);

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
      } else if (path === "/faq") {
        setActiveView("faq");
      } else if (path === "/blog" || path.startsWith("/blog/")) {
        setActiveView("blog");
        if (path.startsWith("/blog/") && path.length > 6) {
          setSelectedBlogSlug(path.substring(6));
        } else {
          setSelectedBlogSlug(null);
        }
      } else if (path === "/admin" || path.startsWith("/admin/")) {
        setActiveView("admin");
      } else {
        setActiveView("home");
      }
    };

    handleUrlRouting();
    window.addEventListener("popstate", handleUrlRouting);

    const isUrlAdmin = window.location.search.includes("admin=true") || window.location.hash === "#admin";
    const isLocalAdmin = localStorage.getItem("gbc_admin_mode") === "true";
    if (isUrlAdmin || isLocalAdmin) {
      setShowAdmin(true);
      if (isUrlAdmin) {
        localStorage.setItem("gbc_admin_mode", "true");
      }
    }

    return () => window.removeEventListener("popstate", handleUrlRouting);
  }, []);

  const handleLogoClick = () => {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setShowAdmin(true);
        localStorage.setItem("gbc_admin_mode", "true");
        setActiveView("admin");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return 0;
      }
      return next;
    });
  };

  // Pre-populate with fallback data from localDb so pages render instantly without blank frames or layout shifts
  const initialData = fetchFallbackData();

  // Dynamic state loaded from Express Backend
  const [rates, setRates] = useState<GoldRate[]>(initialData.rates);
  const [settings, setSettings] = useState<SystemSettings | null>(initialData.settings);
  const [leads, setLeads] = useState<CustomerLead[]>(initialData.leads);
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogsData || initialData.blogs);
  const [historicalRates, setHistoricalRates] = useState<HistoricalRate[]>(initialData.historical);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch authoritative initial data from server
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const jsonCheck = (r: Response) => {
        if (r.ok && r.headers.get("content-type")?.includes("application/json")) {
          return r.json();
        }
        throw new Error(`Non-JSON or error response: ${r.status}`);
      };

      const ts = Date.now();
      const fetchOpts = {
        cache: "no-store" as RequestCache,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
        },
      };

      const [ratesRes, settingsRes, leadsRes, blogsRes, histRes] = await Promise.all([
        fetch(`/api/rates?_t=${ts}`, fetchOpts).then(jsonCheck),
        fetch(`/api/settings?_t=${ts}`, fetchOpts).then(jsonCheck),
        fetch(`/api/leads?_t=${ts}`, fetchOpts).then(jsonCheck),
        fetch(`/api/blogs?_t=${ts}`, fetchOpts).then(jsonCheck),
        fetch(`/api/historical?_t=${ts}`, fetchOpts).then(jsonCheck),
      ]);

      if (Array.isArray(ratesRes) && ratesRes.length > 0) {
        setRates(ratesRes);
        localDb.set("rates", ratesRes);
      }
      if (settingsRes && typeof settingsRes === "object") {
        setSettings(settingsRes);
        localDb.set("settings", settingsRes);
      }
      if (Array.isArray(leadsRes)) {
        setLeads(leadsRes);
        localDb.set("leads", leadsRes);
      }
      if (Array.isArray(blogsRes)) {
        setBlogs(blogsRes);
        localDb.set("blogs", blogsRes);
      }
      if (Array.isArray(histRes)) {
        setHistoricalRates(histRes);
        localDb.set("historical", histRes);
      }
    } catch (e) {
      console.warn("Backend API not reachable or static export mode, using localDb state:", e);
      const fallback = fetchFallbackData();
      setRates((prev) => (prev && prev.length > 0 ? prev : fallback.rates));
      setSettings((prev) => prev || fallback.settings);
      setLeads((prev) => (prev && prev.length > 0 ? prev : fallback.leads));
      setBlogs((prev) => (prev && prev.length > 0 ? prev : fallback.blogs));
      setHistoricalRates((prev) => (prev && prev.length > 0 ? prev : fallback.historical));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Listen for storage / rate update events to keep UI synchronized
    const handleSync = () => {
      const fallback = fetchFallbackData();
      if (fallback.rates && fallback.rates.length > 0) {
        setRates(fallback.rates);
      }
      if (fallback.settings) {
        setSettings(fallback.settings);
      }
      if (fallback.historical && fallback.historical.length > 0) {
        setHistoricalRates(fallback.historical);
      }
    };

    window.addEventListener("gbc_rates_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("gbc_rates_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // API Call Handlers to write updates back to db.json and broadcast
  const handleUpdateRates = async (updatedRates: GoldRate[]) => {
    // 1. Immediately persist to local storage
    localDb.set("rates", updatedRates);
    setRates(updatedRates);

    const nowIso = new Date().toISOString();
    const newSettings = { ...activeSettings, lastUpdated: nowIso };
    localDb.set("settings", newSettings);
    setSettings(newSettings);

    // 2. Update historical chart latest point to reflect the new 22K rate
    const rate22 = updatedRates.find((r) => r.karat === GoldKarat.K22)?.ratePerGram;
    if (rate22 && historicalRates.length > 0) {
      const updatedHist = [...historicalRates];
      const lastIdx = updatedHist.length - 1;
      updatedHist[lastIdx] = {
        ...updatedHist[lastIdx],
        "22K": Math.round(rate22 * activeSettings.pavanWeightGrams),
      };
      localDb.set("historical", updatedHist);
      setHistoricalRates(updatedHist);
    }

    // 3. Dispatch broadcast event for instantaneous UI re-render across components
    window.dispatchEvent(new Event("gbc_rates_updated"));

    // 4. Send POST request to backend API to write to database
    try {
      const response = await fetch("/api/rates", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify(updatedRates),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.rates) {
          setRates(data.rates);
          localDb.set("rates", data.rates);
        }
        if (data.settings) {
          setSettings(data.settings);
          localDb.set("settings", data.settings);
        }
        window.dispatchEvent(new Event("gbc_rates_updated"));
      }
    } catch (e) {
      console.warn("Backend API POST failed; rate change retained locally in browser storage.", e);
    }
  };

  const handleUpdateSettings = async (updatedSettings: SystemSettings) => {
    localDb.set("settings", updatedSettings);
    setSettings(updatedSettings);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify(updatedSettings),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
          localDb.set("settings", data.settings);
        }
      }
    } catch (e) {
      console.warn("Saving to localDb (Static Hosting Mode)");
    }
  };

  const handleDeleteLead = async (id: string) => {
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    localDb.set("leads", updated);

    try {
      await fetch(`/api/leads/${id}`, { method: "DELETE" });
    } catch (e) {
      console.warn("Deleting from localDb (Static Hosting Mode)");
    }
  };

  const handleSaveBlog = async (newBlog: Partial<BlogPost>) => {
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlog),
      });
      if (response.ok) {
        const data = await response.json();
        const freshBlogs = data.blogs || (await fetch("/api/blogs").then((r) => r.json()));
        setBlogs(freshBlogs);
        localDb.set("blogs", freshBlogs);
      } else throw new Error("API not ok");
    } catch (e) {
      console.warn("Saving to localDb (Static Hosting Mode)");
      const blogToSave = { ...newBlog, id: newBlog.id || Date.now().toString() } as BlogPost;
      const updated = newBlog.id ? blogs.map(b => b.id === newBlog.id ? blogToSave : b) : [...blogs, blogToSave];
      localDb.set("blogs", updated);
      setBlogs(updated);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    const updated = blogs.filter((b) => b.id !== id);
    setBlogs(updated);
    localDb.set("blogs", updated);

    try {
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    } catch (e) {
      console.warn("Deleting from localDb (Static Hosting Mode)");
    }
  };

  // Helper defaults to avoid null errors on load
  const todayRate24k = rates.find((r) => r.karat === "24K")?.ratePerGram || rates[0]?.ratePerGram || 0;
  const todayRate22k = rates.find((r) => r.karat === "22K")?.ratePerGram || rates[1]?.ratePerGram || 0;
  const activeSettings = settings || {
    bonusPremiumRate: 2.5,
    testingFeePerGram: 150,
    pavanWeightGrams: 8,
    lastUpdated: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Dynamic SEO Schemas */}
      <SEOSchemas rates={rates} />

      {/* Header */}
      <Header
        currentLang={currentLang}
        setLang={setCurrentLang}
        activeView={activeView}
        setView={setActiveView}
        todayRate24k={todayRate24k}
        todayRate22k={todayRate22k}
        showAdmin={showAdmin}
        onLogoClick={handleLogoClick}
      />

      {/* Primary Views Route Switcher */}
      <main className="pb-16 md:pb-0">
        <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>}>
        {activeView === "home" ? (
          <>
            {/* 1. Hero Section */}
            <ScrollReveal>
              <Hero currentLang={currentLang} todayRate24k={todayRate24k} todayRate22k={todayRate22k} />
            </ScrollReveal>

            {/* 2. Why Choose Gold Buyers Colombo */}
            <ScrollReveal>
              <WhyChooseUs currentLang={currentLang} />
            </ScrollReveal>

            {/* 3. How It Works (4-Step Visual Timeline) */}
            <ScrollReveal>
              <SellingProcess currentLang={currentLang} />
            </ScrollReveal>

            {/* 4. Live Gold Price Dashboard & Calculator */}
            <div id="live-rates">
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

            {/* 9. FAQ Section */}
            <ScrollReveal>
              <FAQSection currentLang={currentLang} />
            </ScrollReveal>

            {/* 10. Educational Resources / Blog Posts */}
            <ScrollReveal>
              <RecentPosts
                currentLang={currentLang}
                blogs={blogs}
                onSelectBlog={(slug) => {
                  setSelectedBlogSlug(slug);
                  setActiveView("blog");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onViewAll={() => {
                  setSelectedBlogSlug(null);
                  setActiveView("blog");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </ScrollReveal>
            
            {/* 11. Final High-Converting CTA & Contact Location */}
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
        ) : activeView === "faq" ? (
          <div className="pt-8 pb-12 min-h-[60vh] bg-white dark:bg-neutral-950 transition-colors">
            <FAQSection currentLang={currentLang} />
          </div>
        ) : activeView === "blog" ? (
          <BlogPreview
            currentLang={currentLang}
            blogs={blogs}
            onRefresh={fetchAllData}
            initialActiveBlogSlug={selectedBlogSlug}
            onBackToCatalog={() => setSelectedBlogSlug(null)}
            onNavigateHomeSection={(sectionId) => {
              setActiveView("home");
              setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }, 100);
            }}
          />
        ) : (
          <AdminDashboard
            currentLang={currentLang}
            rates={rates}
            settings={activeSettings}
            leads={leads}
            blogs={blogs}
            onUpdateRates={handleUpdateRates}
            onUpdateSettings={handleUpdateSettings}
            onDeleteLead={handleDeleteLead}
            onSaveBlog={handleSaveBlog}
            onDeleteBlog={handleDeleteBlog}
          />
        )}
              </Suspense>
      </main>

      {/* Sticky Bottom Bar for Mobile Users */}
      <MobileStickyBar
        currentLang={currentLang}
        todayRate24k={todayRate24k}
        todayRate22k={todayRate22k}
      />

      {/* Floating 'Chat with Consultant' WhatsApp desk */}
      <ChatWithConsultant currentLang={currentLang} />

      {/* Footer */}
      <Footer currentLang={currentLang} setView={setActiveView} showAdmin={showAdmin} onLogoClick={handleLogoClick} />
    </div>
  );
}
