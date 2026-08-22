/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  RefreshCw, 
  Check, 
  Settings, 
  AlertCircle, 
  Zap, 
  Sliders, 
  History, 
  Eye, 
  Sparkles,
  Calculator,
  ShieldCheck,
  RotateCcw,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { GoldKarat, GoldRate, SystemSettings } from "../types.js";
import { Language } from "../lib/translations.js";
import { safeStorage } from "../lib/localDb.js";

interface AdminGoldPriceControlProps {
  rates: GoldRate[];
  settings: SystemSettings;
  onUpdateRates: (updatedRates: GoldRate[]) => Promise<void>;
  onUpdateSettings: (updatedSettings: SystemSettings) => Promise<void>;
  currentLang?: Language;
}

interface RateHistoryLog {
  id: string;
  timestamp: string;
  rates: GoldRate[];
  reason: string;
}

export default function AdminGoldPriceControl({
  rates,
  settings,
  onUpdateRates,
  onUpdateSettings,
}: AdminGoldPriceControlProps) {
  // Local edit copies for rates and settings
  const [editRates, setEditRates] = useState<GoldRate[]>([]);
  const [editSettings, setEditSettings] = useState<SystemSettings | null>(null);

  // Quick 24K base calculation input
  const [base24kInput, setBase24kInput] = useState<number | "">(31250);

  // Status & UI State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [updateReason, setUpdateReason] = useState("Manual Daily Market Adjustment");

  // History log local state
  const [historyLogs, setHistoryLogs] = useState<RateHistoryLog[]>(() => {
    try {
      const saved = safeStorage.getItem("gbc_rate_history");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: "1",
        timestamp: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        rates: [
          { karat: GoldKarat.K24, purity: 0.999, ratePerGram: 31250 },
          { karat: GoldKarat.K22, purity: 0.916, ratePerGram: 28650 },
          { karat: GoldKarat.K21, purity: 0.875, ratePerGram: 27350 },
        ],
        reason: "Initial Morning Opening Rate",
      },
    ];
  });

  // Sync props to local edit state
  useEffect(() => {
    if (rates && rates.length > 0) {
      setEditRates(JSON.parse(JSON.stringify(rates)));
      const k24 = rates.find((r) => r.karat === GoldKarat.K24);
      if (k24) setBase24kInput(k24.ratePerGram);
    }
    if (settings) {
      setEditSettings(JSON.parse(JSON.stringify(settings)));
    }
  }, [rates, settings]);

  // Handle single karat rate change
  const handleRateChange = (idx: number, value: number) => {
    const next = [...editRates];
    next[idx] = { ...next[idx], ratePerGram: Math.max(0, value) };
    setEditRates(next);
  };

  // Handle setting field change
  const handleSettingsChange = (field: keyof SystemSettings, value: number) => {
    if (!editSettings) return;
    setEditSettings({ ...editSettings, [field]: value });
  };

  // Auto-calculate 22K and 21K from 24K pure gold base rate
  const handleAutoCalculateFrom24K = (base24k: number) => {
    if (!base24k || base24k <= 0) return;
    const next = editRates.map((r) => {
      if (r.karat === GoldKarat.K24) {
        return { ...r, ratePerGram: Math.round(base24k) };
      }
      if (r.karat === GoldKarat.K22) {
        return { ...r, ratePerGram: Math.round(base24k * 0.916) };
      }
      if (r.karat === GoldKarat.K21) {
        return { ...r, ratePerGram: Math.round(base24k * 0.875) };
      }
      return { ...r, ratePerGram: Math.round(base24k * r.purity) };
    });
    setEditRates(next);
  };

  // Batch percentage adjustment (+1%, -1%, +2%, etc.)
  const handleApplyPercentageShift = (percent: number) => {
    const multiplier = 1 + percent / 100;
    const next = editRates.map((r) => ({
      ...r,
      ratePerGram: Math.round(r.ratePerGram * multiplier),
    }));
    setEditRates(next);
  };

  // Batch flat LKR shift (+500 LKR, -500 LKR, etc.)
  const handleApplyFlatShift = (deltaLkr: number) => {
    const next = editRates.map((r) => ({
      ...r,
      ratePerGram: Math.max(0, Math.round(r.ratePerGram + deltaLkr)),
    }));
    setEditRates(next);
  };

  // Load Preset
  const handleLoadPreset = (presetName: string, k24: number, k22: number, k21: number) => {
    const next = editRates.map((r) => {
      if (r.karat === GoldKarat.K24) return { ...r, ratePerGram: k24 };
      if (r.karat === GoldKarat.K22) return { ...r, ratePerGram: k22 };
      if (r.karat === GoldKarat.K21) return { ...r, ratePerGram: k21 };
      return r;
    });
    setEditRates(next);
    setBase24kInput(k24);
    setUpdateReason(`Loaded ${presetName} Preset`);
  };

  // Reset to active props rates
  const handleResetToCurrent = () => {
    if (rates && rates.length > 0) {
      setEditRates(JSON.parse(JSON.stringify(rates)));
    }
    if (settings) {
      setEditSettings(JSON.parse(JSON.stringify(settings)));
    }
  };

  // Publish Rate & Settings Updates
  const handlePublishUpdates = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const nowIso = new Date().toISOString();
      const nextSettings = editSettings 
        ? { ...editSettings, lastUpdated: nowIso }
        : { lastUpdated: nowIso, pavanWeightGrams: 8, bonusPremiumRate: 2.5, testingFeePerGram: 150 };

      // 1. Call parents onUpdate
      await onUpdateRates(editRates);
      await onUpdateSettings(nextSettings);

      // 2. Append to audit log
      const newLog: RateHistoryLog = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        rates: JSON.parse(JSON.stringify(editRates)),
        reason: updateReason || "Manual Price Update",
      };

      const nextLogs = [newLog, ...historyLogs].slice(0, 10);
      setHistoryLogs(nextLogs);
      try {
        safeStorage.setItem("gbc_rate_history", JSON.stringify(nextLogs));
      } catch {
        // ignore
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (e) {
      console.error(e);
      alert("Error saving gold rates. Please check network connection.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper calculation values
  const pavanGrams = editSettings?.pavanWeightGrams || 8;
  const bonusPercent = editSettings?.bonusPremiumRate || 2.5;
  const testFee = editSettings?.testingFeePerGram || 150;

  return (
    <div className="space-y-8 text-neutral-100">
      
      {/* Top Banner & Control Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-black p-6 sm:p-8 rounded-2xl border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest mb-3">
              <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>Live Rates Control Panel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
              Gold Price Control & Manual Rate Update
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              Manually calibrate daily per-gram cash rates for 24K, 22K, and 21K gold, adjust sovereign (Pavan) multiples, configure bonus percentages, and broadcast updates instantly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                Last System Sync
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold flex items-center justify-end gap-1">
                <Clock className="h-3 w-3" />
                {settings?.lastUpdated ? new Date(settings.lastUpdated).toLocaleTimeString() : "Just now"}
              </span>
            </div>

            <button
              onClick={handleResetToCurrent}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
              title="Revert modifications to current published prices"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Edits</span>
            </button>

            <button
              onClick={handlePublishUpdates}
              disabled={isSaving}
              className={`px-6 py-2.5 rounded-xl text-neutral-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                saveSuccess
                  ? "bg-emerald-400 text-emerald-950 shadow-emerald-400/20"
                  : "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 shadow-amber-500/20"
              }`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-black" />
                  <span>Publishing...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="h-4 w-4 text-emerald-950" />
                  <span>Published Live!</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-neutral-950" />
                  <span>Publish Gold Rates Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Manual Price Table & Batch Tools (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Quick Batch Tools Section */}
          <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 p-6 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                <span>Quick Batch Adjustment & Auto-Calculator</span>
              </h3>
              <span className="text-[11px] font-mono text-neutral-500">
                Shift all Karats in 1-Click
              </span>
            </div>

            {/* Auto-calculate from 24K pure rate */}
            <div className="bg-black/50 p-4 rounded-xl border border-neutral-800 space-y-3">
              <label className="text-xs font-mono text-neutral-300 font-semibold block">
                Option 1: Auto-Proportion Karats from 24K Pure Gold Base Rate (LKR/g)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">LKR</span>
                  <input
                    type="number"
                    value={base24kInput}
                    onChange={(e) => setBase24kInput(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 31250"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-12 pr-4 py-2 text-sm font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => typeof base24kInput === "number" && handleAutoCalculateFrom24K(base24kInput)}
                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calculator className="h-3.5 w-3.5" />
                  <span>Calculate 22K (91.6%) & 21K (87.5%)</span>
                </button>
              </div>
            </div>

            {/* Quick Shift Triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Percentage Shifts */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-neutral-400 block font-semibold">
                  Option 2: Percentage Shifts
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[-2.0, -1.0, -0.5, 0.5, 1.0, 2.0].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleApplyPercentageShift(pct)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                        pct > 0 
                          ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {pct > 0 ? `+${pct}%` : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flat LKR Shifts */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-neutral-400 block font-semibold">
                  Option 3: Flat LKR/g Shifts
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[-500, -200, 200, 500, 1000].map((shift) => (
                    <button
                      key={shift}
                      type="button"
                      onClick={() => handleApplyFlatShift(shift)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                        shift > 0 
                          ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {shift > 0 ? `+${shift}` : `${shift}`}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Manual Rate Editor Table */}
          <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>Manual Per-Gram Gold Price Controls</span>
              </h3>
              <span className="text-xs font-mono text-neutral-400">
                Pavan Weight: <strong className="text-white">{pavanGrams}g</strong>
              </span>
            </div>

            <div className="space-y-4">
              {editRates.map((rate, idx) => {
                const origRate = rates.find((r) => r.karat === rate.karat)?.ratePerGram || rate.ratePerGram;
                const delta = rate.ratePerGram - origRate;
                const pctChange = origRate > 0 ? ((delta / origRate) * 100).toFixed(1) : "0.0";
                const pavanPrice = Math.round(rate.ratePerGram * pavanGrams);

                return (
                  <div 
                    key={rate.karat}
                    className="bg-black/60 rounded-xl border border-neutral-800 p-4 space-y-3 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-extrabold">
                          {rate.karat} Gold
                        </span>
                        <span className="text-xs font-mono text-neutral-400">
                          ({(rate.purity * 100).toFixed(1)}% Pure Gold)
                        </span>
                      </div>

                      {/* Delta Indicator */}
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-neutral-500">Live Delta:</span>
                        {delta === 0 ? (
                          <span className="text-neutral-400 font-bold">Unchanged</span>
                        ) : delta > 0 ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            +LKR {delta.toLocaleString()} (+{pctChange}%)
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold flex items-center gap-0.5">
                            <ArrowDownRight className="h-3.5 w-3.5" />
                            -LKR {Math.abs(delta).toLocaleString()} ({pctChange}%)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      {/* Rate Input */}
                      <div className="sm:col-span-7 space-y-1">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-semibold">
                          Purchase Rate Per Gram (LKR)
                        </span>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs font-mono text-neutral-500">LKR</span>
                          <input
                            type="number"
                            value={rate.ratePerGram || ""}
                            onChange={(e) => handleRateChange(idx, Number(e.target.value))}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-12 pr-20 py-2.5 text-base font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                          />
                          <div className="absolute right-1 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleRateChange(idx, rate.ratePerGram - 100)}
                              className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono rounded font-bold cursor-pointer"
                              title="Decrease 100 LKR"
                            >
                              -100
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRateChange(idx, rate.ratePerGram + 100)}
                              className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono rounded font-bold cursor-pointer"
                              title="Increase 100 LKR"
                            >
                              +100
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Calculated 1 Pavan Display */}
                      <div className="sm:col-span-5 bg-neutral-900/90 rounded-lg border border-neutral-800 p-2.5 text-right space-y-0.5">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                          Calculated 1 Pavan ({pavanGrams}g)
                        </span>
                        <span className="text-base font-mono font-black text-white block">
                          LKR {pavanPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reason for change */}
            <div className="pt-2 border-t border-neutral-800 space-y-1.5">
              <label className="text-xs font-mono text-neutral-300 font-semibold block">
                Update Note / Reason (Logged for Audit)
              </label>
              <input
                type="text"
                value={updateReason}
                onChange={(e) => setUpdateReason(e.target.value)}
                placeholder="e.g. Morning Opening Market Increase, Global Spot Market Shift"
                className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* System Parameters & Margins */}
          {editSettings && (
            <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2 border-b border-neutral-800 pb-3">
                <Settings className="h-4 w-4" />
                <span>System Liquidation Margins & Assay Deductions</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-neutral-300 font-semibold block">
                    Outright Cash Bonus (%)
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={editSettings.bonusPremiumRate || ""}
                      onChange={(e) => handleSettingsChange("bonusPremiumRate", Number(e.target.value))}
                      className="w-full bg-black border border-neutral-700 rounded-lg pl-3 pr-8 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">%</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 block">
                    Extra cash payout above standard pawn limits.
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-neutral-300 font-semibold block">
                    Testing/Assay Fee (LKR/g)
                  </span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">LKR</span>
                    <input
                      type="number"
                      value={editSettings.testingFeePerGram || ""}
                      onChange={(e) => handleSettingsChange("testingFeePerGram", Number(e.target.value))}
                      className="w-full bg-black border border-neutral-700 rounded-lg pl-12 pr-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 block">
                    Standard melt & computer XRF assay fee deduction per gram.
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-neutral-300 font-semibold block">
                    Pavan Weight (Grams)
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={editSettings.pavanWeightGrams || ""}
                      onChange={(e) => handleSettingsChange("pavanWeightGrams", Number(e.target.value))}
                      className="w-full bg-black border border-neutral-700 rounded-lg pl-3 pr-8 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">g</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 block">
                    Standard Sri Lanka Sovereign weight (8.0g).
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Presets, Live Preview Simulator & History Log (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Presets */}
          <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2 border-b border-neutral-800 pb-2">
              <Zap className="h-4 w-4" />
              <span>Market Rate Presets</span>
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleLoadPreset("Standard Morning Rate", 31250, 28650, 27350)}
                className="w-full text-left p-3 rounded-xl bg-black/50 hover:bg-black border border-neutral-800 hover:border-amber-500/40 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    Standard Morning Opening
                  </span>
                  <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                    Default
                  </span>
                </div>
                <div className="text-[11px] font-mono text-neutral-400 flex justify-between">
                  <span>24K: 31,250</span>
                  <span>22K: 28,650</span>
                  <span>21K: 27,350</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleLoadPreset("Bullish Market Surge", 32000, 29350, 28000)}
                className="w-full text-left p-3 rounded-xl bg-black/50 hover:bg-black border border-neutral-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Bullish Market Surge (+2.4%)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    High
                  </span>
                </div>
                <div className="text-[11px] font-mono text-neutral-400 flex justify-between">
                  <span>24K: 32,000</span>
                  <span>22K: 29,350</span>
                  <span>21K: 28,000</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleLoadPreset("Conservative Market Dip", 30500, 27950, 26700)}
                className="w-full text-left p-3 rounded-xl bg-black/50 hover:bg-black border border-neutral-800 hover:border-rose-500/40 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                    Conservative Market Dip (-2.4%)
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                    Low
                  </span>
                </div>
                <div className="text-[11px] font-mono text-neutral-400 flex justify-between">
                  <span>24K: 30,500</span>
                  <span>22K: 27,950</span>
                  <span>21K: 26,700</span>
                </div>
              </button>
            </div>
          </div>

          {/* Customer View Simulator */}
          <div className="bg-gradient-to-b from-neutral-900 to-black rounded-2xl border border-neutral-800 p-5 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>Live Customer View Preview</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Simulator
              </span>
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 space-y-3 font-sans">
              <div className="text-center pb-2 border-b border-neutral-800/80">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 block font-bold">
                  GBC Live Rate Ticker Preview
                </span>
                <span className="text-xs text-neutral-300 font-serif font-bold">
                  Today's Buying Rate (Colombo)
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {editRates.map((r) => (
                  <div key={r.karat} className="flex justify-between items-center bg-black/40 p-2 rounded border border-neutral-850">
                    <span className="text-neutral-400">{r.karat} Gold (1g):</span>
                    <strong className="text-amber-400">LKR {r.ratePerGram.toLocaleString()}</strong>
                  </div>
                ))}
              </div>

              {/* Sample 2 Pavan Calculation Simulation */}
              <div className="pt-2 border-t border-neutral-800 text-[11px] space-y-1">
                <span className="text-neutral-400 block font-mono">
                  Sample Payout Simulator:
                </span>
                <p className="text-neutral-300 font-semibold leading-normal">
                  2 Pavans (16g) 22K Gold Item:
                </p>
                {(() => {
                  const rate22 = editRates.find((r) => r.karat === GoldKarat.K22)?.ratePerGram || 28650;
                  const baseVal = rate22 * 16;
                  const bonusVal = baseVal * (bonusPercent / 100);
                  const totalEst = Math.round(baseVal + bonusVal);
                  return (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded text-amber-300 font-mono font-bold flex justify-between items-center text-xs">
                      <span>Customer Receives:</span>
                      <span className="text-amber-400 text-sm">LKR {totalEst.toLocaleString()}</span>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Recent Rate Update Audit History Log */}
          <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5 border-b border-neutral-800 pb-2">
              <History className="h-4 w-4" />
              <span>Update History & Audit Trail</span>
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {historyLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-black/40 border border-neutral-850 space-y-1 text-xs font-mono">
                  <div className="flex justify-between items-center text-[10px] text-neutral-400">
                    <span className="font-bold text-amber-400/90">{log.reason}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-neutral-300 flex justify-between">
                    <span>24K: {log.rates.find(r => r.karat === GoldKarat.K24)?.ratePerGram || "-"}</span>
                    <span>22K: {log.rates.find(r => r.karat === GoldKarat.K22)?.ratePerGram || "-"}</span>
                    <span>21K: {log.rates.find(r => r.karat === GoldKarat.K21)?.ratePerGram || "-"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
