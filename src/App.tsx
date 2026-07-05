/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header.js";
import MobileStickyBar from "./components/MobileStickyBar.js";
import Hero from "./components/Hero.js";
import LiveRateWidget from "./components/LiveRateWidget.js";
import GoldCalculator from "./components/GoldCalculator.js";
import SellingProcess from "./components/SellingProcess.js";
import WhyChooseUs from "./components/WhyChooseUs.js";
import Testimonials from "./components/Testimonials.js";
import FAQSection from "./components/FAQSection.js";
import ContactSection from "./components/ContactSection.js";
import BlogPreview from "./components/BlogPreview.js";
import AdminDashboard from "./components/AdminDashboard.js";
import AboutPage from "./components/AboutPage.js";
import ContactPage from "./components/ContactPage.js";
import BranchesPage from "./components/BranchesPage.js";
import InstallWebAppButton from "./components/InstallWebAppButton.js";
import Footer from "./components/Footer.js";
import ExitIntentPopup from "./components/ExitIntentPopup.js";
import RecentPosts from "./components/RecentPosts.js";
import ChatWithConsultant from "./components/ChatWithConsultant.js";
import { Language } from "./lib/translations.js";
import { GoldRate, SystemSettings, CustomerLead, BlogPost, HistoricalRate } from "./types.js";
import { updateMetaTags } from "./lib/seo.js";
import SEOSchemas from "./components/SEOSchemas.js";

export default function App() {
  // Navigation & Language
  const [currentLang, setCurrentLang] = useState<Language>(() => {
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
    localStorage.setItem("gbc_user_lang", currentLang);
  }, [currentLang]);
  const [activeView, setActiveView] = useState<"home" | "blog" | "admin" | "about" | "contact" | "branches">("home");
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
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
        : "Sell your gold jewelry for the highest cash payout in Colombo, Sri Lanka at GBC. 100% transparent computerized XRF testing, certified digital scales, and instant cash.";

      const keywords = "gold buyer in colombo, gold price today colombo, sell gold sri lanka, highest gold price colombo, 22k gold rate colombo, pawning gold colombo, gbc gold buyers, colombo gold merchants";
      
      updateMetaTags(title, desc, keywords);
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
        : "Learn about GBC's commitment to absolute transparency, professional XRF gold verification, certified SLSI weighing standards, and our senior metallurgical board.";

      const keywords = "about gold buyers colombo, trusted gold assayers sri lanka, computer gold testing colombo, gbc history, colombo certified gold buyers";

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
        : "Contact GBC for instant gold valuations and market rates. Get directions to our secure Colombo branches or speak directly with our senior valuation desk today.";

      const keywords = "contact gold buyers colombo, colombo gold buyer phone number, gbc branch address, find gold buyers colombo, sell gold colombo location";

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
        : "Find one of our 16 gold appraisal & buying branches in Colombo. Secure, private locations in Dehiwala, Bambalapitiya, Kohuwala, Nugegoda, and more.";

      const keywords = "gold buyer branches colombo, dehiwala gold buyer, kohuwala gold shop, bambalapitiya gold buyer, sell gold nugegoda, gold buyers near me colombo";

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
    
    // Preserve sub-routes for admin if needed
    if (activeView === "admin" && (currentPath === "/admin/leads" || currentPath === "/admin/rates" || currentPath === "/admin/blog")) {
      targetPath = currentPath;
    }
    
    if (currentPath !== targetPath) {
      window.history.pushState({ view: activeView }, "", targetPath || "/");
    }
  }, [activeView]);

  // Pathname routing on load & popstate + Admin check
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      if (path === "/about") {
        setActiveView("about");
      } else if (path === "/contact") {
        setActiveView("contact");
      } else if (path === "/branches") {
        setActiveView("branches");
      } else if (path === "/blog") {
        setActiveView("blog");
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

  // Dynamic state loaded from Express Backend
  const [rates, setRates] = useState<GoldRate[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [leads, setLeads] = useState<CustomerLead[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [historicalRates, setHistoricalRates] = useState<HistoricalRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data from server
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [ratesRes, settingsRes, leadsRes, blogsRes, histRes] = await Promise.all([
        fetch("/api/rates").then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/leads").then((r) => r.json()),
        fetch("/api/blogs").then((r) => r.json()),
        fetch("/api/historical").then((r) => r.json()),
      ]);

      setRates(ratesRes);
      setSettings(settingsRes);
      setLeads(leadsRes);
      setBlogs(blogsRes);
      setHistoricalRates(histRes);
    } catch (e) {
      console.error("Error fetching full-stack data from Express:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // API Call Handlers to write updates back to db.json
  const handleUpdateRates = async (updatedRates: GoldRate[]) => {
    try {
      const response = await fetch("/api/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRates),
      });
      if (response.ok) {
        setRates(updatedRates);
        // Refresh last updated in settings
        const freshSettings = await fetch("/api/settings").then((r) => r.json());
        setSettings(freshSettings);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const handleUpdateSettings = async (updatedSettings: SystemSettings) => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings),
      });
      if (response.ok) {
        setSettings(updatedSettings);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      const response = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (response.ok) {
        setLeads(leads.filter((l) => l.id !== id));
      }
    } catch (e) {
      console.error(e);
      throw e;
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
        // Refresh blog list
        const freshBlogs = await fetch("/api/blogs").then((r) => r.json());
        setBlogs(freshBlogs);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (response.ok) {
        setBlogs(blogs.filter((b) => b.id !== id));
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  // Helper defaults to avoid null errors on load
  const todayRate24k = rates.find((r) => r.karat === "24K")?.ratePerGram || 31250;
  const todayRate22k = rates.find((r) => r.karat === "22K")?.ratePerGram || 28650;
  const activeSettings = settings || {
    bonusPremiumRate: 2.5,
    testingFeePerGram: 150,
    pavanWeightGrams: 8,
    lastUpdated: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-amber-500 selection:text-black">
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

      {/* Loading state bar */}
      {isLoading && (
        <div className="bg-amber-500 text-black text-center py-1.5 text-xs font-mono font-bold tracking-widest flex items-center justify-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-black animate-ping"></span>
          <span>CONNECTING SECURE DATABASE PIPELINE...</span>
        </div>
      )}

      {/* Primary Views Route Switcher */}
      <main className="pb-16 md:pb-0">
        {activeView === "home" ? (
          <>
            <Hero currentLang={currentLang} />
            
            <LiveRateWidget
              currentLang={currentLang}
              rates={rates.length > 0 ? rates : [
                { karat: "24K", purity: 0.999, ratePerGram: 31250 },
                { karat: "22K", purity: 0.916, ratePerGram: 28650 },
                { karat: "21K", purity: 0.875, ratePerGram: 27350 },
                { karat: "18K", purity: 0.75, ratePerGram: 23450 },
              ]}
              settings={activeSettings}
              historicalRates={historicalRates}
              onRefresh={fetchAllData}
              isLoading={isLoading}
            />

            <GoldCalculator
              currentLang={currentLang}
              rates={rates.length > 0 ? rates : [
                { karat: "24K", purity: 0.999, ratePerGram: 31250 },
                { karat: "22K", purity: 0.916, ratePerGram: 28650 },
                { karat: "21K", purity: 0.875, ratePerGram: 27350 },
                { karat: "18K", purity: 0.75, ratePerGram: 23450 },
              ]}
              settings={activeSettings}
              isLoading={isLoading}
            />

            <SellingProcess currentLang={currentLang} />

            <WhyChooseUs currentLang={currentLang} />

            <Testimonials currentLang={currentLang} />

            <FAQSection currentLang={currentLang} />

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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="download-app">
              <InstallWebAppButton currentLang={currentLang} variant="footer" />
            </div>

            <ContactSection currentLang={currentLang} />
          </>
        ) : activeView === "about" ? (
          <AboutPage currentLang={currentLang} setView={setActiveView} />
        ) : activeView === "contact" ? (
          <ContactPage currentLang={currentLang} />
        ) : activeView === "branches" ? (
          <BranchesPage currentLang={currentLang} />
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
      </main>

      {/* Sticky Bottom Bar for Mobile Users */}
      <MobileStickyBar
        currentLang={currentLang}
        todayRate24k={todayRate24k}
        todayRate22k={todayRate22k}
      />

      {/* Exit Intent conversion pop-up */}
      <ExitIntentPopup currentLang={currentLang} />

      {/* Floating 'Chat with Consultant' WhatsApp desk */}
      <ChatWithConsultant currentLang={currentLang} />

      {/* Footer */}
      <Footer currentLang={currentLang} setView={setActiveView} showAdmin={showAdmin} onLogoClick={handleLogoClick} />
    </div>
  );
}
