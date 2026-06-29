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

export default function App() {
  // Navigation & Language
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [activeView, setActiveView] = useState<"home" | "blog" | "admin" | "about" | "contact">("home");
  const [showAdmin, setShowAdmin] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

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
