/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Lock, Settings, RefreshCw, Trash2, Edit, Plus, FileText, Check, Sparkles, AlertCircle, BarChart3, TrendingUp, HeartPulse, CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp, Eye, ShieldCheck, HelpCircle } from "lucide-react";
import { Language, translations } from "../lib/translations.js";
import { GoldRate, SystemSettings, CustomerLead, BlogPost } from "../types.js";
import RichTextEditor from "./RichTextEditor.js";

interface AdminDashboardProps {
  currentLang: Language;
  rates: GoldRate[];
  settings: SystemSettings;
  leads: CustomerLead[];
  blogs: BlogPost[];
  onUpdateRates: (updatedRates: GoldRate[]) => Promise<void>;
  onUpdateSettings: (updatedSettings: SystemSettings) => Promise<void>;
  onDeleteLead: (id: string) => Promise<void>;
  onSaveBlog: (blog: Partial<BlogPost>) => Promise<void>;
  onDeleteBlog: (id: string) => Promise<void>;
}

export default function AdminDashboard({
  currentLang,
  rates,
  settings,
  leads,
  blogs,
  onUpdateRates,
  onUpdateSettings,
  onDeleteLead,
  onSaveBlog,
  onDeleteBlog,
}: AdminDashboardProps) {
  const t = translations[currentLang];
  
  // Security lock state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [authError, setAuthError] = useState("");

  // Sub-routing for admin page tabs (Leads vs Rates vs Blogs)
  const [activeTab, setActiveTab] = useState<"rates" | "leads" | "blog">(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("/leads")) return "leads";
    if (path.includes("/rates")) return "rates";
    if (path.includes("/blog")) return "blog";
    return "rates"; // default
  });

  // Keep URL pathname in sync with the selected admin tab
  useEffect(() => {
    if (!isAuthenticated) return;
    const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, "");
    const targetPath = `/admin/${activeTab}`;
    if (currentPath !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  }, [activeTab, isAuthenticated]);

  // Rates edit state
  const [editRates, setEditRates] = useState<GoldRate[]>([]);
  const [editSettings, setEditSettings] = useState<SystemSettings | null>(null);
  
  // Blog form state
  const [blogTitle, setBlogTitle] = useState("");
  const [blogCategory, setBlogCategory] = useState("Gold Price");
  const [blogContent, setBlogContent] = useState("");
  const [blogTags, setBlogTags] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("Chief Appraiser");
  const [isBlogSaving, setIsBlogSaving] = useState(false);

  // Predefined blog topics for SEO campaign
  const PREDEFINED_TOPICS = [
    "10 Best Gold Buyers in Colombo (2026)",
    "15 Best Places to Sell Gold in Colombo",
    "12 Trusted Gold Buyers in Sri Lanka",
    "8 Best Cash for Gold Services in Colombo",
    "Top 10 Jewellery Buyers in Colombo",
    "20 Tips Before Selling Gold in Colombo",
    "9 Best Gold Exchange Companies in Colombo",
    "10 Best Gold Dealers in Colombo",
    "Top Gold Buying Companies in Sri Lanka",
    "15 Highest Paying Gold Buyers in Colombo",
    "Top Gold Jewellery Buyers Near Colombo",
    "18 Gold Selling Tips That Save You Money",
    "10 Best Gold Appraisal Services in Colombo",
    "Top Gold Testing Centres in Colombo",
    "Best Gold Buyers for Old Jewellery",
    "Best Gold Buyers for Broken Jewellery",
    "Best Gold Buyers for Antique Jewellery",
    "Best Gold Buyers for Gold Coins",
    "Best Gold Buyers for Bullion",
    "Top Gold Shops That Buy Jewellery"
  ];

  const [selectedPredefinedTopic, setSelectedPredefinedTopic] = useState(PREDEFINED_TOPICS[0]);

  // AI Prompt Assistant state
  const [aiPrompt, setAiPrompt] = useState("Write a highly optimized Colombo SEO guide titled 'How to Avoid Gold Buying Frauds in Colombo 03'. Include details on XRF spectrometer testing.");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Blog Edit / Management state
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [expandedBlogDiagnosticId, setExpandedBlogDiagnosticId] = useState<string | null>(null);

  const handleLoadBlogToEditor = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setBlogTitle(blog.title);
    setBlogCategory(blog.category);
    setBlogContent(blog.content);
    setBlogTags(blog.tags.join(", "));
    setBlogAuthor(blog.author);
    
    // Smooth scroll to the blog CMS form so the admin can immediately see the form
    const editorElement = document.getElementById("blog-cms-form");
    if (editorElement) {
      editorElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const runBlogSchemaDiagnostic = (blog: BlogPost) => {
    // 1. ARTICLE SCHEMA DIAGNOSTIC
    const articlePassed: string[] = [];
    const articleIssues: string[] = [];
    let articleScore = 0;

    // A. Headline
    if (blog.title && blog.title.trim().length > 5) {
      articlePassed.push("Headline (title) is valid and descriptive");
      articleScore += 20;
    } else {
      articleIssues.push("Headline (title) is missing or too short");
    }

    // B. Author
    if (blog.author && blog.author.trim().length > 2) {
      articlePassed.push(`Author is specified: '${blog.author}'`);
      articleScore += 20;
    } else {
      articleIssues.push("Author name is missing (critical for E-E-A-T and Author schema)");
    }

    // C. Date Published / Modified
    if (blog.date || blog.createdAt) {
      articlePassed.push("Date published metadata is defined");
      articleScore += 20;
    } else {
      articleIssues.push("Date published is missing");
    }

    // D. Meta Description / Abstract
    if (blog.metaDescription && blog.metaDescription.trim().length >= 50) {
      articlePassed.push("Meta description is configured and exceeds 50 characters (ideal for search result snippet description)");
      articleScore += 20;
    } else {
      articleIssues.push("Meta description is missing, empty, or too short (should be at least 50 characters for rich snippets)");
    }

    // E. Images and ALT text
    const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
    const imgs = [...blog.content.matchAll(imgRegex)];
    if (imgs.length === 0) {
      articleIssues.push("No embedded images found in content. Articles with relevant images receive better indexing.");
      articleScore += 10; 
    } else {
      let missingAlt = false;
      let weakAlt = false;
      imgs.forEach((match) => {
        const tag = match[0];
        const altMatch = tag.match(/alt=["']([^"']*)["']/i);
        if (!altMatch || !altMatch[1] || altMatch[1].trim() === "") {
          missingAlt = true;
        } else if (!altMatch[1].toLowerCase().includes("gold buyer") && !altMatch[1].toLowerCase().includes("colombo")) {
          weakAlt = true;
        }
      });

      if (missingAlt) {
        articleIssues.push("One or more embedded images are missing ALT text. This harms accessibility and SEO.");
      } else if (weakAlt) {
        articleIssues.push("Alt attributes exist but lack target keywords ('Gold Buyer in Colombo'). Use the Alt SEO tool to optimize.");
        articleScore += 15;
      } else {
        articlePassed.push("All embedded images have highly optimized alt attributes containing target SEO keywords");
        articleScore += 20;
      }
    }

    // 2. FAQ SCHEMA DIAGNOSTIC
    const faqPassed: string[] = [];
    const faqIssues: string[] = [];
    let faqScore = 0;

    if (!blog.questions || blog.questions.length === 0) {
      faqIssues.push("No FAQ schema questions configured. Google cannot display FAQ rich dropdowns for this page.");
      faqScore = 0;
    } else {
      faqPassed.push(`Found ${blog.questions.length} FAQ item(s)`);
      faqScore += 40;

      if (blog.questions.length >= 2) {
        faqPassed.push("Has 2 or more FAQ items (Google recommendation for rich snippets)");
        faqScore += 30;
      } else {
        faqIssues.push("Only 1 FAQ item found. Standard search result snippets display best with 2+ Q&As.");
      }

      // Answer lengths
      const shortAnswers = blog.questions.some((q) => q.a.trim().length < 20);
      if (shortAnswers) {
        faqIssues.push("One or more FAQ answers are too brief (< 20 characters). Content should be thoroughly explanatory.");
      } else {
        faqPassed.push("All FAQ answers have highly comprehensive and descriptive details");
        faqScore += 30;
      }
    }

    // 3. LOCALBUSINESS SCHEMA DIAGNOSTIC
    const lbPassed: string[] = [];
    const lbIssues: string[] = [];
    let lbScore = 0;

    // A. Localized pointers
    if (blog.localizedPointers && blog.localizedPointers.length > 0) {
      lbPassed.push(`Has localized physical pointers: ${blog.localizedPointers.join(", ")}`);
      lbScore += 30;
    } else {
      lbIssues.push("No explicit localized pointers array configured (used for localized schema grounding).");
    }

    // B. Brand Mentions
    const lowerContent = blog.content.toLowerCase() + " " + blog.title.toLowerCase();
    if (lowerContent.includes("gbc") || lowerContent.includes("gold buyers colombo")) {
      lbPassed.push("Explicitly mentions authority brand 'GBC' or 'Gold Buyers Colombo'");
      lbScore += 35;
    } else {
      lbIssues.push("Missing authority brand mention ('GBC' / 'Gold Buyers Colombo') in article text.");
    }

    // C. Local Landmarks & Neighborhoods
    const landmarkKeywords = ["wellawatte", "pettah", "sea street", "bambalapitiya", "galle road", "kollupitiya", "colombo", "sri lanka"];
    const foundKeywords = landmarkKeywords.filter((kw) => lowerContent.includes(kw));

    if (foundKeywords.length >= 3) {
      lbPassed.push(`High GEO-relevance with local landmarks: ${foundKeywords.join(", ")}`);
      lbScore += 35;
    } else if (foundKeywords.length > 0) {
      lbIssues.push(`Weak local grounding. Only mentioned: ${foundKeywords.join(", ")}. Add Wellawatte, Sea Street Pettah, or Colombo 03 landmarks.`);
      lbScore += 15;
    } else {
      lbIssues.push("Lacks local geographical references entirely. Search engines cannot ground this article to the Colombo market.");
    }

    const getStatus = (score: number): "pass" | "warn" | "fail" => {
      if (score >= 90) return "pass";
      if (score >= 50) return "warn";
      return "fail";
    };

    const articleStatus = getStatus(articleScore);
    const faqStatus = getStatus(faqScore);
    const lbStatus = getStatus(lbScore);

    const totalScore = Math.round((articleScore + faqScore + lbScore) / 3);

    return {
      article: { status: articleStatus, score: articleScore, issues: articleIssues, passed: articlePassed },
      faq: { status: faqStatus, score: faqScore, issues: faqIssues, passed: faqPassed },
      localBusiness: { status: lbStatus, score: lbScore, issues: lbIssues, passed: lbPassed },
      totalScore
    };
  };

  // Sync edit states on component mounts
  useEffect(() => {
    if (rates.length > 0) {
      setEditRates(JSON.parse(JSON.stringify(rates)));
    }
    if (settings) {
      setEditSettings(JSON.parse(JSON.stringify(settings)));
    }
  }, [rates, settings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple administrative PIN barrier
    if (pin === "1976" || pin === "gbcadmin") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid administrative security pass code. Access Denied.");
    }
  };

  const handleRateChange = (idx: number, field: keyof GoldRate, value: any) => {
    const next = [...editRates];
    next[idx] = { ...next[idx], [field]: value };
    setEditRates(next);
  };

  const handleSettingsChange = (field: keyof SystemSettings, value: any) => {
    if (!editSettings) return;
    setEditSettings({ ...editSettings, [field]: value });
  };

  const handleSaveRatesAndSettings = async () => {
    try {
      await onUpdateRates(editRates);
      if (editSettings) {
        await onUpdateSettings(editSettings);
      }
      alert("Gold pricing and database settings updated successfully!");
    } catch (e) {
      console.error(e);
      alert("Error saving rates.");
    }
  };

  const handleAiWriterGenerate = async () => {
    if (!aiPrompt) return;
    setIsAiGenerating(true);
    try {
      const response = await fetch("/api/ai-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (response.ok) {
        const data = await response.json();
        // Dynamically auto-fill blog form content with the generated article!
        setBlogContent(data.content);
        if (data.title) setBlogTitle(data.title);
        alert("AI Article composed successfully! Feel free to edit or refine before publishing.");
      } else {
        const errorText = await response.text();
        alert(`AI Writer returned error: ${errorText}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error generating content from server-side Gemini endpoint.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleGeneratePredefinedTopic = async () => {
    setIsAiGenerating(true);
    try {
      // Build a specialized, comprehensive SEO/AEO/GEO prompt incorporating 'GBC' brand
      // and explicit instructions to write and position GBC as the leading Colombo authority.
      // Instructs Gemini to write natural, contextual reference links to internal service & contact anchors
      // and external authorities.
      const promptText = `Write an optimized blog post titled "${selectedPredefinedTopic}".
Target: Colombo Sri Lanka Gold search market.
Brand mention: "GBC" or "Gold Buyers Colombo".
Tone: premium, trustworthy, and expert.
Length: approx 600-900 words.

Ensure you integrate:
1. Internal hyperlinking references:
   - To the Gold Value Calculator using the exact link URL '#calculator'
   - To the Live Gold Rates using the exact link URL '#rates'
   - To the GBC About page/section using the exact link URL '#about'
   - To the GBC Contact page/section using the exact link URL '#contact'
2. External authority links to reputable Sri Lankan institutions:
   - Central Bank of Sri Lanka (https://www.cbsl.gov.lk)
   - National Gem and Jewellery Authority (http://www.gemandjewelleryauthority.gov.lk)

Position GBC as the ultra-transparent, Rolex/Cartier-level premium financial exchange offering computerized XRF testing and certified dual-display weighing.
Include relevant Colombo landmarks (Sea Street Pettah, Wellawatte, Bambalapitiya Galle Road) for local GEO-relevance.`;

      const response = await fetch("/api/ai-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (response.ok) {
        const data = await response.json();
        setBlogContent(data.content);
        if (data.title) setBlogTitle(data.title);
        if (data.category) setBlogCategory(data.category);
        if (data.tags) setBlogTags(data.tags.join(", "));
        alert(`AI Article for "${selectedPredefinedTopic}" composed successfully with 'GBC' brand and hyperlinking patterns! Feel free to edit or refine the populated content below.`);
      } else {
        const errorText = await response.text();
        alert(`AI Writer returned error: ${errorText}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error generating predefined topic content from server-side Gemini endpoint.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handlePublishBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;

    setIsBlogSaving(true);
    try {
      await onSaveBlog({
        id: editingBlogId || undefined,
        title: blogTitle,
        category: blogCategory as BlogPost["category"],
        content: blogContent,
        author: blogAuthor,
        tags: blogTags.split(",").map(t => t.trim()).filter(Boolean),
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      });

      // Clear form and reset edit state
      setBlogTitle("");
      setBlogContent("");
      setBlogTags("");
      setEditingBlogId(null);
      alert(editingBlogId ? "Blog article updated successfully in the database!" : "Blog article published successfully in the database!");
    } catch (e) {
      console.error(e);
      alert("Error saving blog.");
    } finally {
      setIsBlogSaving(false);
    }
  };

  // If locked, render luxury login shield
  if (!isAuthenticated) {
    return (
      <section className="py-24 px-4 bg-black min-h-[70vh] flex items-center justify-center text-white">
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl max-w-sm w-full text-center relative shadow-xl">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-amber-500 border-2 border-black flex items-center justify-center text-black">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-serif font-black mt-4 mb-2 text-white">
            Administrative Access
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed mb-6">
            Enter administrative PIN or pass code to view customer leads, edit live gold prices, or create blogs.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter PIN (e.g. 1976)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded px-3 py-2.5 text-center text-sm font-mono tracking-widest text-amber-500 focus:outline-none focus:border-amber-500"
            />
            {authError && (
              <div className="text-[10px] text-rose-400 flex items-center gap-1 justify-center bg-rose-950/20 py-1.5 rounded">
                <AlertCircle className="h-3 w-3" />
                <span>{authError}</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-black font-extrabold uppercase tracking-wider text-xs rounded transition-all"
            >
              Verify Credentials
            </button>
          </form>

          <p className="text-[10px] text-neutral-600 mt-6 font-mono">
            *Standard trial passcodes: 1976 or gbcadmin
          </p>
        </div>
      </section>
    );
  }

  const computedDiagnostics = blogs.map((blog) => {
    return {
      blog,
      diagnostic: runBlogSchemaDiagnostic(blog),
    };
  });

  const totalArticles = blogs.length;
  const averageHealthScore = totalArticles > 0
    ? Math.round(computedDiagnostics.reduce((acc, curr) => acc + curr.diagnostic.totalScore, 0) / totalArticles)
    : 0;

  const articlePerfectCount = computedDiagnostics.filter((d) => d.diagnostic.article.status === "pass").length;
  const faqPerfectCount = computedDiagnostics.filter((d) => d.diagnostic.faq.status === "pass").length;
  const lbPerfectCount = computedDiagnostics.filter((d) => d.diagnostic.localBusiness.status === "pass").length;

  const articleCoverage = totalArticles > 0 ? Math.round((articlePerfectCount / totalArticles) * 100) : 0;
  const faqCoverage = totalArticles > 0 ? Math.round((faqPerfectCount / totalArticles) * 100) : 0;
  const lbCoverage = totalArticles > 0 ? Math.round((lbPerfectCount / totalArticles) * 100) : 0;

  return (
    <section className="py-16 px-4 bg-neutral-950 text-white min-h-[90vh]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-900 pb-6 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500">
              Control Center
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              GBC Gilt-Edge Admin Portal
            </h2>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-white transition-colors border border-neutral-800 px-3 py-1.5 rounded"
          >
            Logout Secure Session
          </button>
        </div>

        {/* Navigation Tabs for separate administrative URLs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-900 pb-4">
          <button
            onClick={() => setActiveTab("rates")}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 border ${
              activeTab === "rates"
                ? "bg-amber-500 text-neutral-950 border-amber-500 font-extrabold shadow-lg shadow-amber-500/10"
                : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"
            }`}
          >
            🔑 Rates & Pricing Manual Options
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 border ${
              activeTab === "leads"
                ? "bg-amber-500 text-neutral-950 border-amber-500 font-extrabold shadow-lg shadow-amber-500/10"
                : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"
            }`}
          >
            📋 Captured Customer Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 border ${
              activeTab === "blog"
                ? "bg-amber-500 text-neutral-950 border-amber-500 font-extrabold shadow-lg shadow-amber-500/10"
                : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"
            }`}
          >
            ✍️ SEO/AEO Blog Content CMS
          </button>
        </div>

        {/* Tab content area */}
        <div className="space-y-8">
          {/* Rate and Settings Configs */}
          {activeTab === "rates" && (
            <div className="bg-neutral-900/40 rounded-xl border border-neutral-800 p-6 space-y-6 max-w-3xl mx-auto w-full">
              <h3 className="text-sm uppercase tracking-widest font-mono text-amber-400 border-b border-neutral-850 pb-2 flex items-center gap-1.5">
                <Settings className="h-4 w-4" />
                Live Rates & Pricing Manual Options (LKR)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {editRates.map((r, i) => (
                  <div key={r.karat} className="space-y-1">
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      {r.karat} Rate per Gram
                    </span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-600">LKR</span>
                      <input
                        type="number"
                        value={r.ratePerGram || ""}
                        onChange={(e) => handleRateChange(i, "ratePerGram", Number(e.target.value))}
                        className="w-full bg-black border border-neutral-800 rounded pl-12 pr-4 py-2 text-sm font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* General Config parameters */}
              {editSettings && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-900">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      Bonus Premium Rate (%)
                    </span>
                    <input
                      type="number"
                      step="0.1"
                      value={editSettings.bonusPremiumRate || ""}
                      onChange={(e) => handleSettingsChange("bonusPremiumRate", Number(e.target.value))}
                      className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-sm font-mono text-neutral-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      Testing/Cleaning Fee (LKR/g)
                    </span>
                    <input
                      type="number"
                      value={editSettings.testingFeePerGram || ""}
                      onChange={(e) => handleSettingsChange("testingFeePerGram", Number(e.target.value))}
                      className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-sm font-mono text-neutral-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleSaveRatesAndSettings}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Apply Rates & Database Settings
              </button>
            </div>
          )}

          {/* Lead pipeline management */}
          {activeTab === "leads" && (
            <div className="bg-neutral-900/40 rounded-xl border border-neutral-800 p-6 max-w-5xl mx-auto w-full">
              <div className="flex justify-between items-center border-b border-neutral-850 pb-3 mb-4">
                <h3 className="text-sm uppercase tracking-widest font-mono text-amber-400 flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4" />
                  Captured Customer Leads ({leads.length})
                </h3>
              </div>

              {leads.length === 0 ? (
                <div className="text-center py-10 text-neutral-500 font-mono text-xs uppercase">
                  No valuation leads registered yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-neutral-400">
                    <thead>
                      <tr className="border-b border-neutral-850 text-[10px] uppercase font-mono tracking-wider">
                        <th className="pb-3">Client</th>
                        <th className="pb-3">Contact info</th>
                        <th className="pb-3 text-right">Estimate Payout</th>
                        <th className="pb-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-neutral-950/20 transition-colors">
                          <td className="py-3">
                            <strong className="text-white block">{lead.name}</strong>
                            {lead.goldKarat && (
                              <span className="text-[10px] text-amber-500/80 font-mono">
                                {lead.goldKarat} - {lead.weightGrams}g
                              </span>
                            )}
                          </td>
                          <td className="py-3 font-mono">
                            <a href={`tel:${lead.phone}`} className="hover:underline text-amber-400 block">{lead.phone}</a>
                            <span className="text-[10px] text-neutral-600 block">{lead.email || "No email"}</span>
                          </td>
                          <td className="py-3 text-right font-mono font-bold text-white">
                            {lead.estimatedValue ? `LKR ${Math.round(lead.estimatedValue).toLocaleString()}` : "N/A"}
                          </td>
                          <td className="py-3 text-center">
                            <button
                              onClick={() => onDeleteLead(lead.id)}
                              className="p-1.5 rounded border border-neutral-800 hover:border-rose-500/40 text-neutral-500 hover:text-rose-400 transition-colors bg-black"
                              title="Delete Lead"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Blog CMS & AI Assistant Section */}
        {activeTab === "blog" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-neutral-900">
          
          {/* AI Writer (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-neutral-900 to-black rounded-xl border border-amber-500/20 p-6 relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-xl"></div>

            <h3 className="text-sm uppercase tracking-widest font-mono text-amber-400 border-b border-neutral-850 pb-2 mb-4 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              Gemini AI Writing Assistant
            </h3>
            
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Ask Gemini to write an entire local SEO article for your site instantly. This runs securely on your server, ensuring your keys are never leaked to browsers.
            </p>

            <div className="space-y-4">
              <textarea
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-500 font-sans"
              ></textarea>

              <button
                type="button"
                onClick={handleAiWriterGenerate}
                disabled={isAiGenerating}
                className="w-full py-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4.5 w-4.5 text-black" />
                <span>{isAiGenerating ? "Composing article..." : "Generate with AI Writer"}</span>
              </button>

              <div className="border-t border-neutral-800 pt-4 mt-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Predefined GBC Campaigns</span>
                </div>
                
                <p className="text-[11px] text-neutral-450 leading-normal">
                  Select one of GBC's 20 requested high-relevance Colombo gold selling topics to auto-compose a complete, hyperlinked blog article.
                </p>

                <div className="space-y-2">
                  <select
                    value={selectedPredefinedTopic}
                    onChange={(e) => setSelectedPredefinedTopic(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded px-2.5 py-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-500 font-sans"
                  >
                    {PREDEFINED_TOPICS.map((topic, index) => (
                      <option key={index} value={topic}>
                        {index + 1}. {topic}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleGeneratePredefinedTopic}
                    disabled={isAiGenerating}
                    className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 text-amber-400 border border-amber-500/30 hover:border-amber-500/55 font-extrabold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>{isAiGenerating ? "Generating Topic..." : "Generate Predefined Topic"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Blog CMS form (lg:col-span-7) */}
          <div id="blog-cms-form" className="lg:col-span-7 bg-neutral-900/40 rounded-xl border border-neutral-800 p-6 scroll-mt-24">
            <h3 className="text-sm uppercase tracking-widest font-mono text-amber-400 border-b border-neutral-850 pb-2 mb-6 flex items-center gap-1.5">
              {editingBlogId ? <Edit className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              {editingBlogId ? "Edit Published SEO Article" : "Publish New SEO Article"}
            </h3>

            <form onSubmit={handlePublishBlog} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="e.g. 5 Crucial Gold Selling Mistakes"
                    className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-neutral-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Category</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-neutral-300 focus:outline-none focus:border-amber-500"
                  >
                    <option>Gold Price</option>
                    <option>Gold Investment</option>
                    <option>Selling Gold</option>
                    <option>Jewelry</option>
                    <option>Sri Lanka News</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-2">Article Content (WYSIWYG Rich Editor / Supports Google Docs Paste)</label>
                <RichTextEditor
                  value={blogContent}
                  onChange={(val) => setBlogContent(val)}
                  placeholder="Type your content, paste straight from Google Docs (formatting preserved), or generate using the AI assistant..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={blogTags}
                    onChange={(e) => setBlogTags(e.target.value)}
                    placeholder="e.g. gold-buying, colombo-market"
                    className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-neutral-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Author Name</label>
                  <input
                    type="text"
                    required
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-neutral-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                {editingBlogId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBlogId(null);
                      setBlogTitle("");
                      setBlogContent("");
                      setBlogTags("");
                    }}
                    className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-extrabold text-xs uppercase tracking-widest rounded transition-all"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isBlogSaving}
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-neutral-800 text-black font-extrabold text-xs uppercase tracking-widest rounded transition-all"
                >
                  {isBlogSaving ? "Saving..." : editingBlogId ? "Save Changes" : "Publish Article Outright"}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Schema Health-Check & Validation Dashboard */}
        <div className="bg-neutral-900/40 rounded-xl border border-neutral-800 p-6 space-y-6 pt-6 mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-850 pb-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400">
                <HeartPulse className="h-5 w-5 text-amber-500 animate-pulse" />
                <h3 className="text-base font-serif font-bold uppercase tracking-wider">
                  GBC SEO Schema Health & Rich Snippets Dashboard
                </h3>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Validates critical Google Search Engine crawl requirements: Article, FAQ, and LocalBusiness GEO-location schemas.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-neutral-400">Overall Health:</span>
              <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
                <div className={`h-2.5 w-2.5 rounded-full ${averageHealthScore >= 90 ? 'bg-emerald-500' : averageHealthScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                <span className="text-sm font-mono font-bold text-white">{averageHealthScore}%</span>
              </div>
            </div>
          </div>

          {/* Aggregates row */}
          {totalArticles > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-black/40 border border-neutral-850 p-4 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Total Articles Audited</span>
                <span className="text-2xl font-bold text-white mt-1">{totalArticles}</span>
                <span className="text-[10px] text-neutral-400 mt-1">Indexed in sitemap.xml</span>
              </div>
              <div className="bg-black/40 border border-neutral-850 p-4 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Article Schema Pass Rate</span>
                <span className="text-2xl font-bold text-emerald-400 mt-1">{articleCoverage}%</span>
                <span className="text-[10px] text-neutral-400 mt-1">{articlePerfectCount} of {totalArticles} fully optimized</span>
              </div>
              <div className="bg-black/40 border border-neutral-850 p-4 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">FAQ Page Schema Pass Rate</span>
                <span className="text-2xl font-bold text-amber-400 mt-1">{faqCoverage}%</span>
                <span className="text-[10px] text-neutral-400 mt-1">{faqPerfectCount} of {totalArticles} have rich Q&As</span>
              </div>
              <div className="bg-black/40 border border-neutral-850 p-4 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">LocalBusiness Grounding Rate</span>
                <span className="text-2xl font-bold text-amber-500 mt-1">{lbCoverage}%</span>
                <span className="text-[10px] text-neutral-400 mt-1">{lbPerfectCount} of {totalArticles} geo-optimized</span>
              </div>
            </div>
          )}

          {/* List of articles with details */}
          {totalArticles === 0 ? (
            <div className="text-center py-12 border border-dashed border-neutral-800 rounded-lg text-neutral-500 text-xs font-mono">
              <ShieldCheck className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
              NO GENERATED ARTICLES DETECTED IN SYSTEM DATABASE.
              <p className="text-[11px] text-neutral-600 mt-1">Use the Gemini Assistant or Publish form to seed your SEO articles catalog.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {computedDiagnostics.map(({ blog, diagnostic }) => {
                const isExpanded = expandedBlogDiagnosticId === blog.id;
                
                return (
                  <div 
                    key={blog.id} 
                    className={`border rounded-lg transition-all overflow-hidden ${
                      isExpanded 
                        ? 'border-amber-500/40 bg-black/50 shadow-lg' 
                        : 'border-neutral-850 bg-neutral-900/10 hover:border-neutral-850'
                    }`}
                  >
                    {/* Header Row */}
                    <div 
                      onClick={() => setExpandedBlogDiagnosticId(isExpanded ? null : blog.id)}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded uppercase">
                            {blog.category}
                          </span>
                          <span className="text-xs text-neutral-500 font-mono">
                            {blog.date}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white hover:text-amber-400 transition-colors">
                          {blog.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                        {/* Article Schema Badge */}
                        <div className="text-center">
                          <span className="text-[9px] uppercase font-mono text-neutral-500 block">Article</span>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold mt-0.5 ${
                            diagnostic.article.status === "pass" 
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-850" 
                              : diagnostic.article.status === "warn"
                              ? "bg-amber-950/60 text-amber-400 border border-amber-850"
                              : "bg-rose-950/60 text-rose-400 border border-rose-850"
                          }`}>
                            {diagnostic.article.status === "pass" ? "PASS" : diagnostic.article.status === "warn" ? "WARN" : "FAIL"} ({diagnostic.article.score}%)
                          </span>
                        </div>

                        {/* FAQ Schema Badge */}
                        <div className="text-center">
                          <span className="text-[9px] uppercase font-mono text-neutral-500 block">FAQ</span>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold mt-0.5 ${
                            diagnostic.faq.status === "pass" 
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-850" 
                              : diagnostic.faq.status === "warn"
                              ? "bg-amber-950/60 text-amber-400 border border-amber-850"
                              : "bg-rose-950/60 text-rose-400 border border-rose-850"
                          }`}>
                            {diagnostic.faq.status === "pass" ? "PASS" : diagnostic.faq.status === "warn" ? "WARN" : "FAIL"} ({diagnostic.faq.score}%)
                          </span>
                        </div>

                        {/* LocalBusiness Schema Badge */}
                        <div className="text-center">
                          <span className="text-[9px] uppercase font-mono text-neutral-500 block">LocalBusiness</span>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold mt-0.5 ${
                            diagnostic.localBusiness.status === "pass" 
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-850" 
                              : diagnostic.localBusiness.status === "warn"
                              ? "bg-amber-950/60 text-amber-400 border border-amber-850"
                              : "bg-rose-950/60 text-rose-400 border border-rose-850"
                          }`}>
                            {diagnostic.localBusiness.status === "pass" ? "PASS" : diagnostic.localBusiness.status === "warn" ? "WARN" : "FAIL"} ({diagnostic.localBusiness.score}%)
                          </span>
                        </div>

                        {/* Expand Icon */}
                        <div className="text-neutral-500 bg-neutral-950 p-1 rounded hover:text-white border border-neutral-850">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Diagnostic details */}
                    {isExpanded && (
                      <div className="border-t border-neutral-850 p-5 bg-neutral-950/40 text-xs space-y-5">
                        
                        {/* Overall post index summary */}
                        <div className="flex items-center justify-between bg-neutral-900/60 p-3 rounded-lg border border-neutral-850">
                          <div>
                            <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">Crawl Ready Index Score</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-lg font-bold text-white">{diagnostic.totalScore}%</span>
                              <span className="text-[10px] text-neutral-500">for Google Search result snippets</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleLoadBlogToEditor(blog)}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-extrabold rounded text-[10px] uppercase tracking-wider transition-all flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Edit in CMS
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this blog post and remove it from dynamic index schemas?")) {
                                  onDeleteBlog(blog.id);
                                }
                              }}
                              className="px-2.5 py-1.5 border border-neutral-850 hover:border-rose-500/40 text-neutral-400 hover:text-rose-400 rounded text-[10px] uppercase transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          
                          {/* Article Schema detail card */}
                          <div className="space-y-3 bg-neutral-900/20 p-4 rounded-lg border border-neutral-850">
                            <div className="flex items-center justify-between border-b border-neutral-850 pb-1.5">
                              <span className="font-bold text-white flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5 text-neutral-400" />
                                Article Schema
                              </span>
                              <span className={`text-[10px] font-mono font-bold ${diagnostic.article.status === 'pass' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {diagnostic.article.score}%
                              </span>
                            </div>
                            
                            {/* Passed */}
                            {diagnostic.article.passed.length > 0 && (
                              <div className="space-y-1.5">
                                {diagnostic.article.passed.map((msg, i) => (
                                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-neutral-300">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{msg}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Issues */}
                            {diagnostic.article.issues.length > 0 && (
                              <div className="space-y-1.5 pt-2 border-t border-neutral-850/30">
                                <span className="text-[9px] uppercase font-mono text-neutral-500 block">Missing Fields / Warnings:</span>
                                {diagnostic.article.issues.map((msg, i) => (
                                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-neutral-400">
                                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <span>{msg}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* FAQ Schema detail card */}
                          <div className="space-y-3 bg-neutral-900/20 p-4 rounded-lg border border-neutral-850">
                            <div className="flex items-center justify-between border-b border-neutral-850 pb-1.5">
                              <span className="font-bold text-white flex items-center gap-1">
                                <HelpCircle className="h-3.5 w-3.5 text-neutral-400" />
                                FAQ Schema
                              </span>
                              <span className={`text-[10px] font-mono font-bold ${diagnostic.faq.status === 'pass' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {diagnostic.faq.score}%
                              </span>
                            </div>
                            
                            {/* Passed */}
                            {diagnostic.faq.passed.length > 0 && (
                              <div className="space-y-1.5">
                                {diagnostic.faq.passed.map((msg, i) => (
                                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-neutral-300">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{msg}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Issues */}
                            {diagnostic.faq.issues.length > 0 && (
                              <div className="space-y-1.5 pt-2 border-t border-neutral-850/30">
                                <span className="text-[9px] uppercase font-mono text-neutral-500 block">Missing Fields / Warnings:</span>
                                {diagnostic.faq.issues.map((msg, i) => (
                                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-neutral-400">
                                    <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                                    <span>{msg}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* LocalBusiness Schema detail card */}
                          <div className="space-y-3 bg-neutral-900/20 p-4 rounded-lg border border-neutral-850">
                            <div className="flex items-center justify-between border-b border-neutral-850 pb-1.5">
                              <span className="font-bold text-white flex items-center gap-1">
                                <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" />
                                LocalBusiness Grounding
                              </span>
                              <span className={`text-[10px] font-mono font-bold ${diagnostic.localBusiness.status === 'pass' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {diagnostic.localBusiness.score}%
                              </span>
                            </div>
                            
                            {/* Passed */}
                            {diagnostic.localBusiness.passed.length > 0 && (
                              <div className="space-y-1.5">
                                {diagnostic.localBusiness.passed.map((msg, i) => (
                                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-neutral-300">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{msg}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Issues */}
                            {diagnostic.localBusiness.issues.length > 0 && (
                              <div className="space-y-1.5 pt-2 border-t border-neutral-850/30">
                                <span className="text-[9px] uppercase font-mono text-neutral-500 block">Missing Fields / Warnings:</span>
                                {diagnostic.localBusiness.issues.map((msg, i) => (
                                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-neutral-400">
                                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <span>{msg}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
          </>
        )}

      </div>
    </section>
  );
}
