/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, RefreshCw, Landmark, ShieldCheck, Sparkles, MessageCircle, Lock } from "lucide-react";
import { Language, translations } from "../lib/translations.js";
import { GoldRate, HistoricalRate, SystemSettings } from "../types.js";

interface LiveRateWidgetProps {
  currentLang: Language;
  rates: GoldRate[];
  settings: SystemSettings;
  historicalRates: HistoricalRate[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function LiveRateWidget({
  currentLang,
  rates,
  settings,
  historicalRates,
  onRefresh,
  isLoading = false,
}: LiveRateWidgetProps) {
  const t = translations[currentLang];
  const [chartRange, setChartRange] = useState<"Monthly" | "Weekly">("Monthly");

  // Format date nicely
  const formattedDate = new Date(settings.lastUpdated).toLocaleString(
    currentLang === "en" ? "en-US" : currentLang === "si" ? "si-LK" : "ta-LK",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

  // Filter historical rate data based on selected range
  const chartData = chartRange === "Weekly" ? historicalRates.slice(-7) : historicalRates;

  return (
    <section id="rates" className="py-20 px-4 bg-amber-50/70 dark:bg-neutral-900/90 border-t border-amber-200/60 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1 text-amber-700 font-mono text-xs uppercase tracking-widest mb-3 font-semibold">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Live Price Dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-950 mb-4">
            {t.liveRatesTitle}
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t.liveRatesSubtitle}
          </p>
        </div>
 
        {/* Live Rates Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Main Table/Cards (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-sm min-h-[400px]">
            
              <>
                {/* Table Header Controls */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-mono tracking-widest text-neutral-500">
                      {t.lastUpdated}:
                    </span>
                    <span className="text-xs text-amber-700 font-mono font-bold">{formattedDate}</span>
                  </div>
                  {onRefresh && (
                    <button
                      onClick={onRefresh}
                      className="p-2 rounded-full border border-neutral-200 hover:border-amber-500/30 text-neutral-600 hover:text-amber-600 transition-all flex items-center justify-center bg-white shadow-sm active:rotate-180 duration-500 cursor-pointer"
                      title="Refresh Live Rates"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-neutral-200 text-xs font-mono uppercase tracking-wider text-neutral-500">
                        <th className="pb-4 font-normal">{t.karat}</th>
                        <th className="pb-4 font-normal">{t.purity}</th>
                        <th className="pb-4 font-normal text-right">{t.perGram}</th>
                        <th className="pb-4 font-normal text-right">{t.perPavan}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {rates.map((r) => {
                        const ratePerGram = r.ratePerGram;
                        const ratePerPavan = r.ratePerGram * settings.pavanWeightGrams;
                        return (
                          <tr key={r.karat} className="hover:bg-neutral-100 transition-colors group">
                            <td className="py-4 font-serif font-bold text-lg text-neutral-900 group-hover:text-amber-700 transition-colors">
                              {r.karat} Pure Gold
                            </td>
                            <td className="py-4 text-xs font-mono text-neutral-500">
                              {(r.purity * 100).toFixed(1)}% {r.karat === "22K" ? "(916 Hallmarked)" : ""}
                            </td>
                            <td className="py-4 text-right text-base font-bold font-mono text-neutral-900">
                              LKR {Math.round(ratePerGram).toLocaleString()}
                            </td>
                            <td className="py-4 text-right text-base font-bold font-mono text-amber-700">
                              LKR {Math.round(ratePerPavan).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View (Stacked Cards with clear label and price structure) */}
                <div className="block sm:hidden space-y-4">
                  {rates.map((r) => {
                    const ratePerGram = r.ratePerGram;
                    const ratePerPavan = r.ratePerGram * settings.pavanWeightGrams;
                    return (
                      <div
                        key={r.karat}
                        className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/30 transition-all hover:shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                          <span className="text-base font-serif font-extrabold text-amber-700 dark:text-amber-400">
                            {r.karat} Gold
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full">
                            {(r.purity * 100).toFixed(1)}% Pure
                          </span>
                        </div>
                        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3 text-sm">
                          <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200/60 dark:border-neutral-800/80 flex flex-col justify-center">
                            <span className="text-[10px] uppercase font-mono text-neutral-500 dark:text-neutral-400 font-semibold block mb-0.5">
                              Per Gram
                            </span>
                            <strong className="text-neutral-900 dark:text-white font-mono text-sm sm:text-base">
                              LKR {Math.round(ratePerGram).toLocaleString()}
                            </strong>
                          </div>
                          <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex flex-col justify-center">
                            <span className="text-[10px] uppercase font-mono text-amber-700 dark:text-amber-400 font-semibold block mb-0.5">
                              Per Pavan ({settings.pavanWeightGrams}g)
                            </span>
                            <strong className="text-amber-700 dark:text-amber-400 font-mono text-sm sm:text-base">
                              LKR {Math.round(ratePerPavan).toLocaleString()}
                            </strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-neutral-500 italic mt-6 font-mono">
                  {t.ratesDisclaimer}
                </p>

                <div className="mt-6 pt-4 border-t border-neutral-200">
                  <a
                    href="https://wa.me/94718321321?text=Hi%20GBC,%20I%20want%20to%20lock%20today's%20gold%20payout%20rate."
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 no-underline"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" />
                    <span>Lock This Payout on WhatsApp</span>
                  </a>
                </div>
              </>
          </div>
 
          {/* Historical Trends Chart (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-sm min-h-[400px]">
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-neutral-600 flex items-center gap-1.5 font-semibold">
                    <TrendingUp className="h-4 w-4 text-amber-600" />
                    Historical LKR Gold Trends
                  </h3>
                  <div className="inline-flex rounded-md bg-white p-1 border border-neutral-200 text-xs shadow-sm">
                    <button
                      onClick={() => setChartRange("Monthly")}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        chartRange === "Monthly"
                          ? "bg-amber-600 text-black font-extrabold"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      12M
                    </button>
                    <button
                      onClick={() => setChartRange("Weekly")}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        chartRange === "Weekly"
                          ? "bg-amber-600 text-black font-extrabold"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      7M
                    </button>
                  </div>
                </div>

                {/* Interactive Chart using Recharts with strict width/height and wrappers */}
                <div className="h-64 w-full" style={{ width: "100%", height: "256px", minWidth: "100%", minHeight: "256px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="color22K" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d97706" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} />
                      <YAxis
                        stroke="#9ca3af"
                        fontSize={10}
                        domain={["auto", "auto"]}
                        tickLine={false}
                        tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        labelStyle={{ color: "#b45309", fontFamily: "monospace", fontSize: "11px" }}
                        itemStyle={{ color: "#111827", fontSize: "12px" }}
                        formatter={(value: any) => [`LKR ${Number(value).toLocaleString()}`, "22K Per Gram"]}
                      />
                      <Area isAnimationActive={false}
                        type="monotone"
                        dataKey="22K"
                        stroke="#d97706"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#color22K)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
     
                {/* GBC Buying Bonus Card */}
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-amber-600/5 via-yellow-500/5 to-transparent border border-amber-500/20 flex items-center gap-3">
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-700 flex-shrink-0">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-black text-amber-700 uppercase tracking-wider">
                      Outright Liquidation Premium
                    </h4>
                    <p className="text-[11px] text-neutral-600 leading-normal mt-0.5">
                      Get paid up to <strong>+{settings.bonusPremiumRate}% extra</strong> bonus value for selling outright compared to commercial pawn rate limits.
                    </p>
                  </div>
                </div>
              </>
          </div>

        </div>
      </div>
    </section>
  );
}
