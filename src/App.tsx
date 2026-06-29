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
import InstallWebAppButton from "./components/InstallWebAppButton.js";
import Footer from "./components/Footer.js";
import ExitIntentPopup from "./components/ExitIntentPopup.js";
import { Language } from "./lib/translations.js";
import { GoldRate, SystemSettings, CustomerLead, BlogPost, HistoricalRate } from "./types.js";
import { updateMetaTags } from "./lib/seo.js";

export default function App() {
  // Navigation & Language
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [activeView, setActiveView] = useState<"home" | "blog" | "admin" | "about" | "contact">("home");
  const [showAdmin, setShowAdmin] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  // Dynamic SEO Page Title & Meta description updates for GEO / CRO / AEO
  useEffect(() => {
    // Skip blog view metadata updates here because BlogPreview component manages its own internal 
    // active article detail view versus catalog listing metadata dynamically.
    if (activeView === "blog") return;

    if (activeView === "home") {
      const title = currentLang === "si" 
        ? "රන් බයර්ස් කොළඹ (GBC) | ලංකාවේ රන් සඳහා ඉහළම මුදලක්"
        : currentLang === "ta"
        ? "கோல்ட் பையர்ஸ் கொழும்பு | இலங்கையில் தங்கத்திற்கு மிக உயர்ந்த விலை"
        : "Gold Buyers Colombo (GBC) | Highest Cash Price for Gold in Sri Lanka";

      const desc = currentLang === "si"
        ? "කොළඹින් රන් සඳහා ඉහළම මුදලක් ලබා ගන්න. 100% විනිවිද පෙනෙන පරිගණකගත XRF පරීක්ෂාව, සහතික කළ ඩිජිටල් තරාදි සහ ක්ෂණික මුදල් හෝ බැංකු මාරු කිරීම්."
        : currentLang === "ta"
        ? "கொழும்பில் தங்கத்திற்கு மிக உயர்ந்த தொகையைப் பெறுங்கள். 100% வெளிப்படையான கணினிமயமாக்கப்பட்ட XRF சோதனை, சான்றளிக்கப்பட்ட டிஜிட்டல் தராசுகள் மற்றும் உடனடி ரொக்கம்."
        : "Sell gold in Colombo for the highest payout. 100% transparent computerized XRF spectroscopic testing, certified digital scales, and instant cash or bank transfers.";

      const keywords = "gold buyer in colombo, gold price today colombo, sell gold sri lanka, highest gold price colombo, 22k gold rate colombo, pawning gold colombo, gbc gold buyers, colombo gold merchants";
      
      updateMetaTags(title, desc, keywords);
    } else if (activeView === "about") {
      const title = currentLang === "si"
        ? "අප ගැන - ගෝල්ඩ් බයර්ස් කොළඹ | සහතික ලත් රන් පරීක්ෂකවරුන්"
        : currentLang === "ta"
        ? "எங்களைப் பற்றி - கோல்ட் பையர்ஸ் கொழும்பு | சான்றளிக்கப்பட்ட தங்க மதிப்பீட்டாளர்கள்"
        : "About Us - Gold Buyers Colombo | Certified Assayers & Metallurgical Desk";

      const desc = currentLang === "si"
        ? "විනිවිදභාවය, වෘත්තීය XRF රන් සත්‍යාපනය, සහතික කළ SLSI බර මැනීමේ ප්‍රමිතීන් සහ අපගේ ජ්‍යෙෂ්ඨ ලෝහ විද්‍යා මණ්ඩලය පිළිබඳව දැනගන්න."
        : currentLang === "ta"
        ? "வெளிப்படைத்தன்மை, தொழில்முறை XRF தங்க சரிபார்ப்பு, சான்றளிக்கப்பட்ட SLSI எடை அளவீட்டு தரநிலைகள் மற்றும் எங்கள் மூத்த உலோகவியல் குழு பற்றி அறியவும்."
        : "Learn about Gold Buyers Colombo's commitment to transparency, professional XRF gold verification, certified SLSI weighing standards, and our senior metallurgical board.";

      const keywords = "about gold buyers colombo, trusted gold assayers sri lanka, computer gold testing colombo, gbc history, colombo certified gold buyers";

      updateMetaTags(title, desc, keywords);
    } else if (activeView === "contact") {
      const title = currentLang === "si"
        ? "සම්බන්ධ වන්න - ගෝල්ඩ් බයර්ස් කොළඹ | ආරක්ෂිත ශාඛා පිහිටීම සහ දුරකථනය"
        : currentLang === "ta"
        ? "தொடர்புகொள்ள - கோல்ட் பையர்ஸ் கொழும்பு | பாதுகாப்பான கிளை முகவரி மற்றும் தொலைபேசி"
        : "Contact Gold Buyers Colombo | Secure Appraisal Branch Location & Phone";

      const desc = currentLang === "si"
        ? "රන් ක්ෂණිකව තක්සේරු කර ගැනීමට ගෝල්ඩ් බයර්ස් කොළඹ අමතන්න. කොළඹ 03, ගාලු පාරේ පිහිටි අපගේ ආරක්ෂිත ශාඛාවට පැමිණෙන්න හෝ අප අමතන්න."
        : currentLang === "ta"
        ? "உடனடி தங்க மதிப்பீடுகளுக்கு கோல்ட் பையர்ஸ் கொழும்பை தொடர்பு கொள்ளவும். கொழும்பு 03, காலி வீதியில் உள்ள எங்கள் பாதுகாப்பான கிளைக்கு வருகை தரவும்."
        : "Contact Gold Buyers Colombo for instant gold valuations. Get directions to our secure Galle Road, Colombo 03 branch or speak directly with our senior valuation desk.";

      const keywords = "contact gold buyers colombo, colombo gold buyer phone number, gbc branch address, find gold buyers colombo, sell gold colombo location";

      updateMetaTags(title, desc, keywords);
    } else if (activeView === "admin") {
      updateMetaTags(
        "Secure Admin Dashboard | Gold Buyers Colombo",
        "Administrative controls for Gold Buyers Colombo system metrics, daily rates calibration, and customer inquiry processing.",
        "gbc admin, gold buyers colombo admin dashboard"
      );
    }
  }, [activeView, currentLang]);

  useEffect(() => {
    const isUrlAdmin = window.location.search.includes("admin=true") || window.location.hash === "#admin";
    const isLocalAdmin = localStorage.getItem("gbc_admin_mode") === "true";
    if (isUrlAdmin || isLocalAdmin) {
      setShowAdmin(true);
      if (isUrlAdmin) {
        localStorage.setItem("gbc_admin_mode", "true");
      }
    }
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="download-app">
              <InstallWebAppButton currentLang={currentLang} variant="footer" />
            </div>

            <ContactSection currentLang={currentLang} />
          </>
        ) : activeView === "about" ? (
          <AboutPage currentLang={currentLang} setView={setActiveView} />
        ) : activeView === "contact" ? (
          <ContactPage currentLang={currentLang} />
        ) : activeView === "blog" ? (
          <BlogPreview
            currentLang={currentLang}
            blogs={blogs}
            onRefresh={fetchAllData}
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

      {/* Footer */}
      <Footer currentLang={currentLang} setView={setActiveView} showAdmin={showAdmin} onLogoClick={handleLogoClick} />
    </div>
  );
}
