/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Lock, Settings, RefreshCw, Trash2, Edit, Plus, FileText, Check, Sparkles, AlertCircle, BarChart3, TrendingUp } from "lucide-react";
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
        title: blogTitle,
        category: blogCategory,
        content: blogContent,
        author: blogAuthor,
        tags: blogTags.split(",").map(t => t.trim()).filter(Boolean),
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      });

      // Clear form
      setBlogTitle("");
      setBlogContent("");
      setBlogTags("");
      alert("Blog article published successfully in the database!");
    } catch (e) {
      console.error(e);
      alert("Error publishing blog.");
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

        {/* Dashboard Grid blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Rate and Settings Configs (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-neutral-900/40 rounded-xl border border-neutral-800 p-6 space-y-6">
              <h3 className="text-sm uppercase tracking-widest font-mono text-amber-400 border-b border-neutral-850 pb-2 flex items-center gap-1.5">
                <Settings className="h-4 w-4" />
                Live Rates & Pricing (LKR)
              </h3>

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

              {/* General Config parameters */}
              {editSettings && (
                <>
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
                </>
              )}

              <button
                onClick={handleSaveRatesAndSettings}
                className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-yellow-500 text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all"
              >
                Apply Rates & Database Settings
              </button>
            </div>
          </div>

          {/* Lead pipeline management (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Leads Table Card */}
            <div className="bg-neutral-900/40 rounded-xl border border-neutral-800 p-6">
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
          </div>

        </div>

        {/* Blog CMS & AI Assistant Section */}
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
          <div className="lg:col-span-7 bg-neutral-900/40 rounded-xl border border-neutral-800 p-6">
            <h3 className="text-sm uppercase tracking-widest font-mono text-amber-400 border-b border-neutral-850 pb-2 mb-6 flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              Publish New SEO Article
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

              <button
                type="submit"
                disabled={isBlogSaving}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-neutral-800 text-black font-extrabold text-xs uppercase tracking-widest rounded transition-all mt-4"
              >
                {isBlogSaving ? "Publishing..." : "Publish Article Outright"}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
