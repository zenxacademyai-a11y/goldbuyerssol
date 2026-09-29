/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Lock, Trash2, AlertCircle, BarChart3, ArrowLeft } from "lucide-react";
import { Language, translations } from "../lib/translations.js";
import { GoldRate, SystemSettings, CustomerLead } from "../types.js";
import AdminGoldPriceControl from "./AdminGoldPriceControl.js";
import AdminDatabaseManager from "./AdminDatabaseManager.js";

interface AdminDashboardProps {
  currentLang: Language;
  rates: GoldRate[];
  settings: SystemSettings;
  leads: CustomerLead[];
  onUpdateRates: (updatedRates: GoldRate[]) => Promise<void>;
  onUpdateSettings: (updatedSettings: SystemSettings) => Promise<void>;
  onDeleteLead: (id: string) => Promise<void>;
  onViewSite?: () => void;
}

export default function AdminDashboard({
  currentLang,
  rates,
  settings,
  leads,
  onUpdateRates,
  onUpdateSettings,
  onDeleteLead,
  onViewSite,
}: AdminDashboardProps) {
  const t = translations[currentLang];
  
  // Security lock state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [authError, setAuthError] = useState("");

  // Sub-routing for admin page tabs (Rates vs Leads vs Database)
  const [activeTab, setActiveTab] = useState<"rates" | "leads" | "database">(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("/leads")) return "leads";
    if (path.includes("/rates")) return "rates";
    if (path.includes("/database")) return "database";
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple administrative PIN barrier
    if (pin === "@Buyers2026" || pin === "gbcadmin") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid administrative security pass code. Access Denied.");
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
            Enter administrative PIN or pass code to manage customer valuation leads, live gold rates, and MySQL database.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter PIN"
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
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-black font-extrabold uppercase tracking-wider text-xs rounded transition-all cursor-pointer"
            >
              Verify Credentials
            </button>
          </form>
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
          <div className="flex items-center gap-3">
            {onViewSite && (
              <button
                onClick={onViewSite}
                className="text-xs font-mono font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-neutral-950 px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/10"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>View Live Website</span>
              </button>
            )}
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors border border-neutral-800 hover:border-neutral-700 px-3 py-2 rounded-xl cursor-pointer"
            >
              Logout Secure Session
            </button>
          </div>
        </div>

        {/* Navigation Tabs for separate administrative URLs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-900 pb-4">
          <button
            onClick={() => setActiveTab("rates")}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
              activeTab === "rates"
                ? "bg-amber-500 text-neutral-950 border-amber-500 font-extrabold shadow-lg shadow-amber-500/10"
                : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"
            }`}
          >
            🔑 Rates & Pricing Manual Options
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
              activeTab === "leads"
                ? "bg-amber-500 text-neutral-950 border-amber-500 font-extrabold shadow-lg shadow-amber-500/10"
                : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"
            }`}
          >
            📋 Captured Customer Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab("database")}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
              activeTab === "database"
                ? "bg-amber-500 text-neutral-950 border-amber-500 font-extrabold shadow-lg shadow-amber-500/10"
                : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"
            }`}
          >
            🗄️ MySQL & phpMyAdmin Database
          </button>
        </div>

        {/* Tab content area */}
        <div className="space-y-8">
          {/* Rate and Settings Configs */}
          {activeTab === "rates" && (
            <AdminGoldPriceControl
              rates={rates}
              settings={settings}
              onUpdateRates={onUpdateRates}
              onUpdateSettings={onUpdateSettings}
              currentLang={currentLang}
              onViewSite={onViewSite}
            />
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
                              className="p-1.5 rounded border border-neutral-800 hover:border-rose-500/40 text-neutral-500 hover:text-rose-400 transition-colors bg-black cursor-pointer"
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

          {/* MySQL & phpMyAdmin Database Management */}
          {activeTab === "database" && (
            <div className="pt-4 border-t border-neutral-900">
              <AdminDatabaseManager />
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
